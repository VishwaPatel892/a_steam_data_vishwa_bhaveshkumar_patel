import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isPositive: { type: Boolean, required: true },
    text: { type: String, maxlength: 2000, default: '' },
    playtimeAtReview: { type: Number, default: 0 }, // in hours
    helpfulVotes: { type: Number, default: 0 },
    funnyVotes: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// A user can only review a game once
reviewSchema.index({ gameId: 1, userId: 1 }, { unique: true });

// Optimize for fetching helpful reviews for a game
reviewSchema.index({ gameId: 1, helpfulVotes: -1 });

export default mongoose.model('Review', reviewSchema);

// Model structure verified
