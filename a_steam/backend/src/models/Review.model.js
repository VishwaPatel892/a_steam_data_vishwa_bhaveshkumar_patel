import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: [true, "Game is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    content: {
      type: String,
      required: [true, "Review content is required"],
      minlength: [10, "Review must be at least 10 characters"],
      maxlength: [2000, "Review cannot exceed 2000 characters"],
    },
    recommended: { type: Boolean, default: true },
    helpfulVotes: { type: Number, default: 0 },
    playtimeAtReview: { type: Number, default: 0 }, // hours
  },
  { timestamps: true, versionKey: false }
);

// One review per user per game
reviewSchema.index({ user: 1, game: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
