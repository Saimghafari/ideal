import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import {
  FULFILLMENT_STAGES,
  PREP_MINUTE_OPTIONS,
  stageFromStatus,
  statusFromStage,
} from "@/lib/orderTracking";
import OrderModel from "@/models/Order.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const body = await request.json();
    const { _id, status, fulfillmentStage, prepMinutes } = body;

    if (!_id || (!status && !fulfillmentStage)) {
      return response(false, 400, "Order id and status are required.");
    }

    const orderData = await OrderModel.findById(_id);
    if (!orderData) return response(false, 404, "Order not found.");

    const nextStage = FULFILLMENT_STAGES.includes(fulfillmentStage)
      ? fulfillmentStage
      : stageFromStatus(status);

    orderData.fulfillmentStage = nextStage;
    orderData.status = status && !fulfillmentStage ? status : statusFromStage(nextStage);
    if (PREP_MINUTE_OPTIONS.includes(Number(prepMinutes))) {
      orderData.prepMinutes = Number(prepMinutes);
    }
    orderData.stageUpdatedAt = new Date();
    await orderData.save();

    return response(true, 200, "Order status updated successfully.", orderData);
  } catch (error) {
    return catchError(error);
  }
}
