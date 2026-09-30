import mongoose from "mongoose";
import { normalizeSlug } from "@/lib/normalizeSlug";

const branchSchema = new mongoose.Schema(
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
    shortName: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    hours: {
      type: String,
      trim: true,
      default: "",
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    prepMinutes: {
      type: Number,
      enum: [10, 20],
      default: 20,
    },
    isActive: {
      type: Boolean,
      default: true,
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

branchSchema.pre("validate", function (next) {
  if (this.slug) this.slug = normalizeSlug(this.slug);
  next();
});

branchSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

if (mongoose.models.Branch && !mongoose.models.Branch.schema.path("prepMinutes")) {
  delete mongoose.models.Branch;
  delete mongoose.connection.models.Branch;
}

const BranchModel =
  mongoose.models.Branch || mongoose.model("Branch", branchSchema, "branches");

export default BranchModel;
