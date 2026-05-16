const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');

// Models
const Game = require('../models/Game.model');
const Developer = require('../models/Developer.model');
const Publisher = require('../models/Publisher.model');
const Genre = require('../models/Genre.model');

// Database config
const connectDB = require('../config/db');

// Cache maps to prevent duplicate queries and optimize speed
const developerMap = new Map();
const publisherMap = new Map();
const genreMap = new Map();

// Helper to get or create ObjectId from string
async function getOrCreateDocs(model, map, namesString) {
    if (!namesString) return [];
    const names = namesString.split(';').map(n => n.trim()).filter(n => n);
    const objectIds = [];
    
    for (const name of names) {
        if (map.has(name)) {
            objectIds.push(map.get(name));
        } else {
            let doc = await model.findOne({ name });
            if (!doc) {
                try {
                    doc = await model.create({ name });
                } catch (err) {
                    if (err.code === 11000) {
                        // In case of a race condition duplicate
                        doc = await model.findOne({ name });
                    } else {
                        throw err;
                    }
                }
            }
            map.set(name, doc._id);
            objectIds.push(doc._id);
        }
    }
    return objectIds;
}

const importData = async () => {
    try {
        await connectDB();
        
        console.log("Loading JSON file... (this may take a moment)");
        const dataPath = path.join(__dirname, 'steamData.json');
        
        if (!fs.existsSync(dataPath)) {
            console.error("Dataset not found at src/seeds/steamData.json!");
            process.exit(1);
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const games = JSON.parse(rawData);
        
        console.log(`Successfully loaded ${games.length} games. Starting import...`);
        
        // Clear existing data to avoid duplicates/errors if re-run
        console.log("Clearing existing database collections...");
        await Game.deleteMany({});
        await Developer.deleteMany({});
        await Publisher.deleteMany({});
        await Genre.deleteMany({});
        
        const batchSize = 1000;
        let successCount = 0;

        for (let i = 0; i < games.length; i += batchSize) {
            const batch = games.slice(i, i + batchSize);
            const gameDocs = [];
            
            for (const item of batch) {
                const devs = await getOrCreateDocs(Developer, developerMap, item.developer);
                const pubs = await getOrCreateDocs(Publisher, publisherMap, item.publisher);
                const gens = await getOrCreateDocs(Genre, genreMap, item.genres);
                
                const releaseDate = item.release_date && item.release_date !== "To be announced" 
                                    ? new Date(item.release_date) 
                                    : null;
                                    
                const price = parseFloat(item.price) || 0;
                
                gameDocs.push({
                    steamAppId: parseInt(item.appid) || null,
                    name: item.name || "Unknown Game",
                    releaseDate: isNaN(releaseDate) ? null : releaseDate,
                    developer: devs,
                    publisher: pubs,
                    genre: gens,
                    tags: item.categories ? item.categories.split(';').map(c => c.trim()) : [],
                    price: price,
                    isFree: price === 0,
                    reviewCount: parseInt(item.recommendations) || 0
                });
            }
            
            try {
                // ordered: false allows continuing even if there's a duplicate key error
                await Game.insertMany(gameDocs, { ordered: false });
                successCount += batch.length;
            } catch (err) {
                // If some documents were inserted before error
                if (err.insertedDocs) {
                    successCount += err.insertedDocs.length;
                }
            }

            console.log(`Processed ${Math.min(i + batchSize, games.length)} / ${games.length} games...`);
        }
        
        console.log(`Data Import Complete! Successfully inserted ~${successCount} games.`);
        process.exit();
    } catch (error) {
        console.error("Error during data import:", error);
        process.exit(1);
    }
};

importData();
