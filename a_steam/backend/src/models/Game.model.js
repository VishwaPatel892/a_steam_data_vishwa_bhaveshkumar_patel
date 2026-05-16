const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
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
    developer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" }],
    publisher: [{ type: mongoose.Schema.Types.ObjectId, ref: "Publisher" }],
    genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
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
  },
  { timestamps: true, versionKey: false }
);

// Full-text search index
gameSchema.index({ name: "text", tags: "text" });

module.exports = mongoose.model("Game", gameSchema);
