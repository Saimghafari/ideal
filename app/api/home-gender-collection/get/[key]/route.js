import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { getStaticProducts } from "@/lib/staticCatalog";
import { seedHomeContentIfNeeded } from "@/lib/homeContentService";
import { catchError, response } from "@/lib/helperFunction";
import HomeGenderCollectionModel from "@/models/HomeGenderCollection.model";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    await seedHomeContentIfNeeded(getStaticProducts());

    const { key } = await params;
    if (!["men", "women"].includes(key)) {
      return response(false, 400, "Invalid collection key.");
    }

    const collection = await HomeGenderCollectionModel.findOne({ key })
      .populate("featuredMedia", "secure_url alt title")
      .populate("items.image", "secure_url alt title")
      .lean();

    if (!collection) {
      return response(false, 404, "Collection not found.");
    }

    return response(true, 200, "Collection found.", collection);
  } catch (error) {
    return catchError(error);
  }
}
