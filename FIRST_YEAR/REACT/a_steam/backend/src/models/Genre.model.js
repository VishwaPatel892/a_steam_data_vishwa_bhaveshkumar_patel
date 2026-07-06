import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Genre name is required"],
      unique: true,
      trim: true,
    },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

// Auto-generate slug from name before saving
genreSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

export default mongoose.model("Genre", genreSchema);
