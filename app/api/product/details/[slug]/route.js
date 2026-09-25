import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getProductDetailsBySlug } from "@/lib/getProductDetailsBySlug";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request, { params }) {
  try {
    await connectDB();

    const getParams = await params;
    const slug = getParams.slug;
    const size = request.nextUrl.searchParams.get("size");

    const result = await getProductDetailsBySlug(slug, size);

    if (result.error) {
      return response(false, 503, result.message || "Failed to load product.");
    }

    if (!result.success || result.notFound) {
      return response(false, 404, result.message || "Product not found.");
    }

    return response(true, 200, result.message, result.data);
  } catch (error) {
    return catchError(error);
  }
}
