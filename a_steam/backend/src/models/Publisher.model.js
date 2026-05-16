const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Publisher name is required"],
      unique: true,
      trim: true,
    },
    country: { type: String, default: "" },
    website: { type: String, default: "" },
    foundedYear: { type: Number },
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Publisher", publisherSchema);
