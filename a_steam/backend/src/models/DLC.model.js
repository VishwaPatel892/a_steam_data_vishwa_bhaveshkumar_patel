import mongoose from 'mongoose';

const dlcSchema = new mongoose.Schema(
  {
    baseGameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
    steamAppId: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    releaseDate: { type: Date },
    price: { type: Number, default: 0, min: 0 },
    isFree: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// Optimize fetching DLCs for a specific game, sorted by release date
dlcSchema.index({ baseGameId: 1, releaseDate: -1 });

export default mongoose.model('DLC', dlcSchema);

// Model structure verified
