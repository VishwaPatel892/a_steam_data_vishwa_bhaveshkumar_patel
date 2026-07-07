import mongoose from 'mongoose';

const gameUpdateSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
    versionString: { type: String, required: true },
    patchSizeMB: { type: Number, required: true },
    updateNotes: { type: String, default: '' },
    isMajor: { type: Boolean, default: false },
    releasedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, versionKey: false }
);

// Optimize fetching patch history for a game
gameUpdateSchema.index({ gameId: 1, releasedAt: -1 });

export default mongoose.model('GameUpdate', gameUpdateSchema);
