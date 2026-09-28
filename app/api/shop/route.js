import { response } from "@/lib/helperFunction";
import { queryShopCatalog } from "@/lib/liveCatalog";
import { SHOP_PRICE_MAX } from "@/lib/staticCatalog";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const hasMax = searchParams.has("maxPrice");

  const { products, nextPage } = await queryShopCatalog({
    page: parseInt(searchParams.get("page"), 10) || 0,
    limit: parseInt(searchParams.get("limit"), 10) || 9,
    sort: searchParams.get("sort") || "default_sorting",
    category: searchParams.get("category"),
    q: searchParams.get("q") || searchParams.get("search"),
    minPrice: parseInt(searchParams.get("minPrice"), 10) || 0,
    maxPrice: hasMax ? parseInt(searchParams.get("maxPrice"), 10) || SHOP_PRICE_MAX : null,
    size: searchParams.get("size"),
    availability: searchParams.get("availability"),
  });

  return response(true, 200, "Product data found.", { products, nextPage });
}
