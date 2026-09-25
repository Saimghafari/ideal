export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import MediaModel from "@/models/Media.model";

void MediaModel;

export async function GET() {
  try {
    await connectDB();

    let getProduct = await ProductModel.find({
      deletedAt: null,
      featured: true,
    })
      .populate("media", "secure_url alt title")
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    // If no featured products found, get latest products as fallback
    if (!getProduct || getProduct.length === 0) {
      getProduct = await ProductModel.find({
        deletedAt: null,
      })
        .populate("media", "secure_url alt title")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    }

    if (!getProduct || getProduct.length === 0) {
      return response(false, 404, "No products found.");
    }

    const ids = getProduct.map((p) => p._id);
    const variants = await ProductVariantModel.find({
      product: { $in: ids },
      deletedAt: null,
    })
      .select("_id product size color mrp sellingPrice discountPercentage")
      .lean();

    const byProduct = new Map();
    for (const v of variants) {
      const key = String(v.product);
      if (!byProduct.has(key)) byProduct.set(key, v);
    }

    const withVariants = getProduct.map((product) => {
      const variant = byProduct.get(String(product._id));
      return {
        ...product,
        variants: variant ? [variant] : [],
      };
    });

    return response(true, 200, "Products found.", withVariants);
  } catch (error) {
    return catchError(error);
  }
}
