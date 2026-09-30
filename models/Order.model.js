import { orderStatus } from "@/lib/utils";
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: false,
    },

    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: false,
    },
    landmark: {
      type: String,
      required: false,
    },
    ordernote: {
      type: String,
      required: false,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
          required: false,
          default: null,
        },
        name: { type: String, required: true },
        size: { type: String, required: false, default: null },
        qty: { type: Number, required: true },
        mrp: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    couponDiscountAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "PKR"],
      default: "PKR",
    },
    status: {
      type: String,
      enum: orderStatus,
      default: "unpaid",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: false,
      default: null,
    },
    branchName: {
      type: String,
      required: false,
      default: "",
    },
    serviceType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },
    fulfillmentStage: {
      type: String,
      enum: ["received", "preparing", "on_the_way", "delivered", "cancelled"],
      default: "received",
    },
    prepMinutes: {
      type: Number,
      default: 20,
    },
    stageUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    payment_method: {
      type: String,
      enum: ["Invoice", "COD"],
      default: "Invoice",
    },
    payment_id: {
      type: String,
      required: false,
      default: null,
    },
    order_id: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

if (
  mongoose.models.Order &&
  !mongoose.models.Order.schema.path("fulfillmentStage")
) {
  delete mongoose.models.Order;
  delete mongoose.connection.models.Order;
}

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema, "orders");
export default OrderModel;
