import { response } from "@/lib/helperFunction";
import { getShopCategories } from "@/lib/liveCatalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getShopCategories();
  return response(true, 200, "Category found.", categories);
}
