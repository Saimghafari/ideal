import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import MediaModel from "@/models/Media.model";
import { formatWallSize } from "@/lib/wallDecorSizes";
import { absoluteUrl } from "@/lib/siteMeta";

void MediaModel;

const placeholder = absoluteUrl("/logo.png");

/**
 * Enrich order line items with display image + formatted size for emails.
 */
export async function enrichOrderProductsForEmail(products = []) {
  return Promise.all(
    products.map(async (line) => {
      let image = placeholder;
      let sizeLabel = line.size || "";

      try {
        if (line.variantId) {
          const variant = await ProductVariantModel.findById(line.variantId)
            .populate("media", "secure_url")
            .lean();
          if (variant?.media?.[0]?.secure_url) {
            image = variant.media[0].secure_url;
          }
          if (!sizeLabel && variant?.size) {
            sizeLabel = formatWallSize(variant.size) || variant.size;
          }
        }

        if (image === placeholder && line.productId) {
          const product = await ProductModel.findById(line.productId)
            .populate("media", "secure_url")
            .lean();
          if (product?.media?.[0]?.secure_url) {
            image = product.media[0].secure_url;
          }
        }
      } catch {
        // keep placeholder
      }

      return {
        name: line.name,
        qty: line.qty,
        sellingPrice: line.sellingPrice,
        size: sizeLabel ? formatWallSize(sizeLabel) || sizeLabel : "",
        image,
      };
    })
  );
}
