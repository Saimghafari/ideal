import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getPublicBranches } from "@/lib/getBranches";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const branches = await getPublicBranches();
    return response(
      true,
      200,
      "Branches found.",
      branches.filter((branch) => branch._id)
    );
  } catch (error) {
    return catchError(error);
  }
}
