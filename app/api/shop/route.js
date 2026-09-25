import { response } from "@/lib/helperFunction";
import { queryStaticShop } from "@/lib/staticCatalog";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  const { products, nextPage } = queryStaticShop({
    page: parseInt(searchParams.get("page"), 10) || 0,
    limit: parseInt(searchParams.get("limit"), 10) || 9,
    sort: searchParams.get("sort") || "default_sorting",
    category: searchParams.get("category"),
    q: searchParams.get("q") || searchParams.get("search"),
    minPrice: parseInt(searchParams.get("minPrice"), 10) || 0,
    maxPrice: parseInt(searchParams.get("maxPrice"), 10) || 100000,
    size: searchParams.get("size"),
  });

  return response(true, 200, "Product data found.", { products, nextPage });
}
