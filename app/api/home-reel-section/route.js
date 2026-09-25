import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { getStaticProducts } from "@/lib/staticCatalog";
import { seedHomeContentIfNeeded } from "@/lib/homeContentService";
import { catchError, response } from "@/lib/helperFunction";
import HomeReelSectionModel from "@/models/HomeReelSection.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    await seedHomeContentIfNeeded(getStaticProducts());

    const sections = await HomeReelSectionModel.find()
      .populate("reels.poster", "secure_url alt title")
      .lean();

    return response(true, 200, "Reel sections found.", sections);
  } catch (error) {
    return catchError(error);
  }
}
