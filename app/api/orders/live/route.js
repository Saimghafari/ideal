export const dynamic = "force-dynamic";

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { resolveFulfillmentStage } from "@/lib/orderTracking";
import OrderModel from "@/models/Order.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const orders = await OrderModel.find({ deletedAt: null, createdAt: { $gte: start } })
      .sort({ createdAt: -1 })
      .limit(40)
      .select(
        "order_id name phone city landmark totalAmount currency fulfillmentStage prepMinutes serviceType branchName stageUpdatedAt createdAt status products"
      )
      .lean();

    return response(
      true,
      200,
      "Live orders.",
      orders.map((order) => ({
        _id: String(order._id),
        order_id: order.order_id,
        name: order.name,
        phone: order.phone,
        city: order.city,
        landmark: order.landmark || "",
        totalAmount: order.totalAmount,
        currency: order.currency || "PKR",
        fulfillmentStage: resolveFulfillmentStage(order),
        prepMinutes: order.prepMinutes || 20,
        serviceType: order.serviceType || "delivery",
        branchName: order.branchName || "",
        stageUpdatedAt: order.stageUpdatedAt || order.createdAt,
        createdAt: order.createdAt,
        status: order.status,
        products: (order.products || []).map((item) => ({
          name: item.name,
          qty: item.qty,
        })),
      }))
    );
  } catch (error) {
    return catchError(error);
  }
}
