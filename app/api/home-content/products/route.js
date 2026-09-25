import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { getProductOptions } from "@/lib/homeContentService";
import { catchError, response } from "@/lib/helperFunction";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    try {
      await connectDB();
    } catch {
      // Static products still work if Mongo is unavailable.
    }

    const products = await getProductOptions();
    return response(true, 200, "Products found.", products);
  } catch (error) {
    return catchError(error);
  }
}
