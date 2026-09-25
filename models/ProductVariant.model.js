import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: String,
      required: false,
      trim: true,
      default: "Default",
    },
    size: {
      type: String,
      required: true,
      trim: true,
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
    sku: {
      type: String,
      required: true,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Unique only among active variants so trash doesn't block re-adding the same SKU
ProductVariantSchema.index(
  { sku: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

if (
  mongoose.models.ProductVariant &&
  !mongoose.models.ProductVariant.schema.path("mrpPkr")
) {
  delete mongoose.models.ProductVariant;
  delete mongoose.connection.models.ProductVariant;
}

const ProductVariantModel =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", ProductVariantSchema, "productvariants");
export default ProductVariantModel;
