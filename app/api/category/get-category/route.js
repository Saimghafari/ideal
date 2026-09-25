import { response } from "@/lib/helperFunction";
import { getStaticCategories } from "@/lib/staticCatalog";

export async function GET() {
  return response(true, 200, "Category found.", getStaticCategories());
}
