export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { resolveFulfillmentStage, trackingHeadline } from "@/lib/orderTracking";
import OrderModel from "@/models/Order.model";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { orderid } = await params;
    const order = await OrderModel.findOne({ order_id: String(orderid || "").trim(), deletedAt: null })
      .select(
        "order_id status fulfillmentStage prepMinutes serviceType branchName stageUpdatedAt createdAt name"
      )
      .lean();

    if (!order) return response(false, 404, "Order not found.");

    const snapshot = {
      ...order,
      fulfillmentStage: resolveFulfillmentStage(order),
    };

    return response(true, 200, "Order tracking.", {
      order_id: order.order_id,
      fulfillmentStage: snapshot.fulfillmentStage,
      prepMinutes: order.prepMinutes || 20,
      serviceType: order.serviceType || "delivery",
      branchName: order.branchName || "",
      stageUpdatedAt: order.stageUpdatedAt || order.createdAt,
      createdAt: order.createdAt,
      headline: trackingHeadline(snapshot),
    });
  } catch (error) {
    return catchError(error);
  }
}
