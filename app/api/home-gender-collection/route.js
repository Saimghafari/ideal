import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { getStaticProducts } from "@/lib/staticCatalog";
import { seedHomeContentIfNeeded } from "@/lib/homeContentService";
import { catchError, response } from "@/lib/helperFunction";
import HomeGenderCollectionModel from "@/models/HomeGenderCollection.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    await seedHomeContentIfNeeded(getStaticProducts());

    const collections = await HomeGenderCollectionModel.find()
      .populate("featuredMedia", "secure_url alt title")
      .populate("items.image", "secure_url alt title")
      .lean();

    return response(true, 200, "Homepage collections found.", collections);
  } catch (error) {
    return catchError(error);
  }
}
