import mongoose from "mongoose";
import { normalizeSlug } from "@/lib/normalizeSlug";

const productSchema = new mongoose.Schema(
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    mrpPkr: {
      type: Number,
      required: false,
      default: 0,
    },
    sellingPricePkr: {
      type: Number,
      required: false,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    discountPercentagePkr: {
      type: Number,
      required: false,
      default: 0,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.slug) {
    this.slug = normalizeSlug(this.slug);
  }
  next();
});

productSchema.index({ category: 1 });
// Unique only among active products so trash doesn't block re-adding the same slug
productSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

// Re-register when schema gains new paths (Next.js HMR keeps stale models)
if (
  mongoose.models.Product &&
  !mongoose.models.Product.schema.path("mrpPkr")
) {
  delete mongoose.models.Product;
  delete mongoose.connection.models.Product;
}

const ProductModel =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "products");
export default ProductModel;
