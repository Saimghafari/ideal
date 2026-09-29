import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { getStaticProducts } from "@/lib/staticCatalog";
import { seedHomeContentIfNeeded } from "@/lib/homeContentService";
import { catchError, response } from "@/lib/helperFunction";
import HomeReelSectionModel from "@/models/HomeReelSection.model";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    await seedHomeContentIfNeeded(getStaticProducts());

    const { placement } = await params;
    if (!["after_sweets", "after_bakery"].includes(placement)) {
      return response(false, 400, "Invalid reel section.");
    }

    const section = await HomeReelSectionModel.findOne({ placement })
      .populate("reels.poster", "secure_url alt title")
      .lean();

    if (!section) {
      return response(false, 404, "Reel section not found.");
    }

    return response(true, 200, "Reel section found.", section);
  } catch (error) {
    return catchError(error);
  }
}
