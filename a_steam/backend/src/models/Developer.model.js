const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Developer name is required"],
      unique: true,
      trim: true,
    },
    country: { type: String, default: "" },
    website: { type: String, default: "" },
    foundedYear: { type: Number },
    logoUrl: { type: String, default: "" },
    teamSize: {
      type: String,
      enum: ["indie", "small", "mid", "large", "aaa"],
      default: "indie",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Developer", developerSchema);
