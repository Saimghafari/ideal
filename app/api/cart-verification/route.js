import { catchError, response } from "@/lib/helperFunction";
import { formatWallSize } from "@/lib/wallDecorSizes";
import { CURRENCY_PKR, resolvePrices } from "@/lib/currency";
import { connectDB } from "@/lib/databaseConnection";
import { getStaticProducts } from "@/lib/staticCatalog";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import { isValidObjectId } from "mongoose";

void MediaModel;

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!Array.isArray(payload)) {
      return response(false, 400, "Invalid cart payload.");
    }

    const catalog = getStaticProducts();
    const objectIds = payload
      .map((item) => item?.productId)
      .filter((id) => isValidObjectId(id));

    const byId = new Map();
    if (objectIds.length) {
      try {
        await connectDB();
        const docs = await ProductModel.find({
          _id: { $in: objectIds },
          deletedAt: null,
        })
          .populate({ path: "media", select: "secure_url" })
          .populate({ path: "category", select: "name slug" })
          .select("name slug media category mrp sellingPrice mrpPkr sellingPricePkr deliverable branches")
          .lean();

        docs.forEach((doc) => byId.set(String(doc._id), doc));
      } catch (error) {
        console.error("Cart product lookup failed:", error);
      }
    }

    const verifiedCartData = payload
      .map((cartItem) => {
        if (!cartItem) return null;
        const productId = cartItem.productId || cartItem.variantId;
        const live = byId.get(String(productId));

        if (live) {
          const prices = resolvePrices(live);
          return {
            productId: String(live._id),
            variantId: cartItem.variantId && isValidObjectId(cartItem.variantId)
              ? String(cartItem.variantId)
              : String(live._id),
            name: live.name,
            url: live.slug,
            size: cartItem.size ? formatWallSize(cartItem.size) : null,
            color: null,
            mrp: prices.mrp,
            sellingPrice: prices.sellingPrice,
            currency: CURRENCY_PKR,
            media: live.media?.[0]?.secure_url,
            qty: cartItem.qty || 1,
            deliverable: live.deliverable !== false,
            categoryName: live.category?.name || "",
            branchIds: (live.branches || []).map((id) => String(id)),
          };
        }

        const product = catalog.find((item) => item._id === productId);
        if (!product) return null;

        const prices = resolvePrices(product);
        return {
          productId: product._id,
          variantId: product._id,
          name: product.name,
          url: product.slug,
          size: cartItem.size ? formatWallSize(cartItem.size) : null,
          color: null,
          mrp: prices.mrp,
          sellingPrice: prices.sellingPrice,
          currency: CURRENCY_PKR,
          media: product.media?.[0]?.secure_url,
          qty: cartItem.qty || 1,
          deliverable: product.deliverable !== false,
          categoryName: product.category?.name || "",
          branchIds: [],
        };
      })
      .filter(Boolean);

    return response(true, 200, "Verified Cart Data.", verifiedCartData);
  } catch (error) {
    return catchError(error);
  }
}
