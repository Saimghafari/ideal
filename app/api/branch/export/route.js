import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BranchModel from "@/models/Branch.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    const rows = await BranchModel.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
    return response(true, 200, "Data found.", rows);
  } catch (error) {
    return catchError(error);
  }
}
