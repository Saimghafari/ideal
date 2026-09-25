export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getOrderByOrderId } from "@/lib/getOrderByOrderId";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const getParams = await params;
    const result = await getOrderByOrderId(getParams.orderid);

    if (!result.success) {
      return response(false, 404, result.message || "Order not found.");
    }

    return response(true, 200, result.message, result.data);
  } catch (error) {
    return catchError(error);
  }
}
