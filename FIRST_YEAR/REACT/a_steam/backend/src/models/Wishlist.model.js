import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    games: [
      {
        gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
        addedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

// Optimize fetching a user's wishlist
wishlistSchema.index({ userId: 1 });

export default mongoose.model('Wishlist', wishlistSchema);
