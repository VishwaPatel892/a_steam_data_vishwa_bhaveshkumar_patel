import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    iconUrl: { type: String, default: '' },
    rarityPercent: { type: Number, default: 0, min: 0, max: 100 }, // Precomputed rarity based on player unlocks
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// Optimize fetching achievements for a specific game
achievementSchema.index({ gameId: 1, rarityPercent: 1 });

export default mongoose.model('Achievement', achievementSchema);

// Model structure verified
