import { connectDB } from "@/lib/databaseConnection";
import OrderModel from "@/models/Order.model";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import BranchModel from "@/models/Branch.model";

void MediaModel;
void ProductModel;
void ProductVariantModel;
void BranchModel;

export async function getOrderByOrderId(orderid) {
  await connectDB();

  const id = String(orderid || "").trim();
  if (!id) {
    return { success: false, message: "Order not found.", data: null };
  }

  const orderData = await OrderModel.findOne({ order_id: id })
    .populate({
      path: "products.productId",
      select: "name slug media",
      populate: { path: "media", select: "secure_url" },
    })
    .populate({
      path: "products.variantId",
      populate: { path: "media", select: "secure_url" },
    })
    .populate({ path: "branch", select: "name shortName address" })
    .lean();

  if (!orderData) {
    return { success: false, message: "Order not found.", data: null };
  }

  return {
    success: true,
    message: "Order found.",
    data: orderData,
  };
}
