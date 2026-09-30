import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BranchModel from "@/models/Branch.model";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

void MediaModel;

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    const { id } = await params;
    if (!isValidObjectId(id)) return response(false, 400, "Invalid object id.");

    const branch = await BranchModel.findOne({ _id: id, deletedAt: null })
      .populate({ path: "media", select: "secure_url alt title" })
      .lean();

    if (!branch) return response(false, 404, "Branch not found.");

    return response(true, 200, "Branch found.", {
      ...branch,
      _id: String(branch._id),
      media: branch.media
        ? { ...branch.media, _id: String(branch.media._id) }
        : null,
    });
  } catch (error) {
    return catchError(error);
  }
}
