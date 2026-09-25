import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
    url: { type: String, trim: true, default: "" },
    alt: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const homeGenderCollectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ["men", "women"],
      index: true,
    },
    title: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    featuredMedia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },
    featuredUrl: { type: String, trim: true, default: "" },
    featuredAlt: { type: String, trim: true, default: "" },
    items: { type: [itemSchema], default: [] },
  },
  { timestamps: true }
);

const HomeGenderCollectionModel =
  mongoose.models.HomeGenderCollection ||
  mongoose.model("HomeGenderCollection", homeGenderCollectionSchema);

export default HomeGenderCollectionModel;
