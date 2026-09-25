import { catchError, response } from "@/lib/helperFunction";
import { formatWallSize } from "@/lib/wallDecorSizes";
import { CURRENCY_PKR, resolvePrices } from "@/lib/currency";
import { getStaticProducts } from "@/lib/staticCatalog";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!Array.isArray(payload)) {
      return response(false, 400, "Invalid cart payload.");
    }

    const catalog = getStaticProducts();

    const verifiedCartData = payload
      .map((cartItem) => {
        if (!cartItem) return null;
        const productId = cartItem.productId || cartItem.variantId;
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
        };
      })
      .filter(Boolean);

    return response(true, 200, "Verified Cart Data.", verifiedCartData);
  } catch (error) {
    return catchError(error);
  }
}
