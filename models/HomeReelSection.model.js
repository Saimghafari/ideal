import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    productSlug: { type: String, trim: true, default: "" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    videoUrl: { type: String, required: true, trim: true },
    poster: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
    posterUrl: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const homeReelSectionSchema = new mongoose.Schema(
  {
    placement: {
      type: String,
      required: true,
      unique: true,
      enum: ["after_men", "after_women"],
      index: true,
    },
    reels: { type: [reelSchema], default: [] },
  },
  { timestamps: true }
);

const HomeReelSectionModel =
  mongoose.models.HomeReelSection ||
  mongoose.model("HomeReelSection", homeReelSectionSchema);

export default HomeReelSectionModel;
