import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    appid: { type: Number, sparse: true },
    steamAppId: { type: Number, unique: true, sparse: true },
    name: {
      type: String,
      required: [true, "Game name is required"],
      trim: true,
      index: true,
    },
    description: { type: String, default: "" },
    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    headerImage: { type: String, default: "" },
    releaseDate: { type: Date },
    release_date: { type: String },
    release_year: { type: mongoose.Schema.Types.Mixed },
    developer: { type: [String], default: [] },
    publisher: { type: [String], default: [] },
    genre: { type: [String], default: [] },
    genres: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    recommendations: { type: mongoose.Schema.Types.Mixed },
    tags: { type: [String], default: [] },
    platforms: {
      windows: { type: Boolean, default: false },
      mac: { type: Boolean, default: false },
      linux: { type: Boolean, default: false },
    },
    price: { type: Number, default: 0, min: 0 },
    isFree: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    metacriticScore: { type: Number, min: 0, max: 100 },
    website: { type: String, default: "" },
    isArchived: { type: Boolean, default: false },
    history: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
  },
  { 
    timestamps: true, 
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for popularity based on review count
gameSchema.virtual('isPopular').get(function() {
  return this.reviewCount >= 10000;
});

// Full-text search index
gameSchema.index({ name: "text", tags: "text" });

// Production Compound Indexes for Query Optimization
gameSchema.index({ averageRating: -1, price: 1 });
gameSchema.index({ developer: 1, releaseDate: -1 });
gameSchema.index({ createdAt: -1 });

export default mongoose.model("Game", gameSchema);
