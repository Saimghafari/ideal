export function fallbackVariantFromProduct(product) {
  return {
    _id: product._id,
    product: product._id,
    size: null,
    color: null,
    mrp: product.mrp,
    sellingPrice: product.sellingPrice,
    mrpPkr: product.mrpPkr ?? 0,
    sellingPricePkr: product.sellingPricePkr ?? 0,
    discountPercentage: product.discountPercentage,
    media: product.media || [],
    isProductFallback: true,
  };
}
