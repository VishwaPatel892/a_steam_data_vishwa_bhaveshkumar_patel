import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Developer' },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// Optimize fetching news feed for a game
newsSchema.index({ gameId: 1, publishedAt: -1 });

export default mongoose.model('News', newsSchema);
