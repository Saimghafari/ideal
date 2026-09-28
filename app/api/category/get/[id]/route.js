import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { isValidObjectId } from "mongoose";
import CategoryModel from "@/models/Category.model";
import MediaModel from "@/models/Media.model";

void MediaModel;

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const getParams = await params;
    const id = getParams.id;

    const filter = {
      deletedAt: null,
    };

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid object id.");
    }

    filter._id = id;

    const getCategory = await CategoryModel.findOne(filter)
      .populate({
        path: "media",
        select: "secure_url alt title",
        options: { lean: true },
      })
      .lean();

    if (!getCategory) {
      return response(false, 404, "Category not found.");
    }

    return response(true, 200, "Category found.", {
      ...getCategory,
      _id: String(getCategory._id),
      media: getCategory.media
        ? {
            ...getCategory.media,
            _id: String(getCategory.media._id),
          }
        : null,
      parent: getCategory.parent ? String(getCategory.parent) : "",
    });
  } catch (error) {
    return catchError(error);
  }
}
