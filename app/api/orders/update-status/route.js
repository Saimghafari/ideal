import { orderStatusEmail } from "@/email/orderNotification";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { enrichOrderProductsForEmail } from "@/lib/enrichOrderProductsForEmail";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import OrderModel from "@/models/Order.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const { _id, status } = await request.json();

    if (!_id || !status) {
      return response(false, 400, "Order id and status are required.");
    }

    const orderData = await OrderModel.findById(_id);

    if (!orderData) {
      return response(false, 404, "Order not found.");
    }

    const previousStatus = orderData.status;
    orderData.status = status;
    await orderData.save();

    if (previousStatus !== status && orderData.email) {
      try {
        const products = await enrichOrderProductsForEmail(
          orderData.products || []
        );
        const subjectByStatus = {
          unpaid: `Your Velora order ${orderData.order_id}`,
          paid: `Payment received — order ${orderData.order_id}`,
          processing: `Your order is being prepared — ${orderData.order_id}`,
          shipped: `Your order has shipped — ${orderData.order_id}`,
          delivered: `Your order was delivered — ${orderData.order_id}`,
          cancelled: `Your order was cancelled — ${orderData.order_id}`,
          pending: `Order update — ${orderData.order_id}`,
          unverified: `Order update — ${orderData.order_id}`,
        };

        await sendMail(
          subjectByStatus[status] ||
            `Order update — ${orderData.order_id}`,
          orderData.email,
          orderStatusEmail({
            customer_name: orderData.name,
            order_id: orderData.order_id,
            status,
            products,
            currency: orderData.currency || "PKR",
          }),
          { refId: orderData.order_id }
        );
      } catch (error) {
        console.log("Status email error:", error);
      }
    }

    return response(
      true,
      200,
      "Order status updated successfully.",
      orderData
    );
  } catch (error) {
    return catchError(error);
  }
}
