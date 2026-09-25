import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Unique only among active categories so trash doesn't block re-adding the same name/slug
categorySchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);
categorySchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

const CategoryModel =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema, "categories");
export default CategoryModel;
