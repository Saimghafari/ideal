import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import BranchModel from "@/models/Branch.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    let matchQuery = {};
    if (deleteType === "SD") matchQuery = { deletedAt: null };
    else if (deleteType === "PD") matchQuery = { deletedAt: { $ne: null } };

    if (globalFilter) {
      matchQuery.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        { address: { $regex: globalFilter, $options: "i" } },
      ];
    }

    filters.forEach((filter) => {
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    });

    const sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    const data = await BranchModel.find(matchQuery)
      .sort(Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 })
      .skip(start)
      .limit(size)
      .lean();

    const totalRowCount = await BranchModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
