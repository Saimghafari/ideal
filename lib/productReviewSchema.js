import ReviewModel from "@/models/Review.model";

/**
 * Real review data for Product JSON-LD — never fabricates ratings or reviews.
 * Returns null when a product has no published reviews.
 */
export async function getProductReviewSchemaData(productId) {
  if (!productId) return null;

  const match = { product: productId, deletedAt: null };

  const [stats, recentReviews] = await Promise.all([
    ReviewModel.aggregate([
      { $match: match },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]),
    ReviewModel.find(match)
      .sort({ createdAt: -1 })
      .limit(5)
      .select("rating title review createdAt user")
      .populate("user", "name")
      .lean(),
  ]);

  const reviewCount = stats.reduce((sum, row) => sum + row.count, 0);
  if (reviewCount === 0) return null;

  const ratingValue = (
    stats.reduce((sum, row) => sum + row._id * row.count, 0) / reviewCount
  ).toFixed(1);

  return {
    reviewCount,
    ratingValue,
    reviews: recentReviews.map((item) => ({
      author: item.user?.name || "Super Ideal customer",
      datePublished: item.createdAt,
      reviewBody: item.review,
      name: item.title,
      ratingValue: item.rating,
    })),
  };
}
