import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import BranchModel from "@/models/Branch.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list.");
    }

    const rows = await BranchModel.find({ _id: { $in: ids } });
    if (!rows.length) return response(false, 404, "Data not found.");

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid delete operation.");
    }

    if (deleteType === "SD") {
      await Promise.all(
        rows.map((row) => {
          const id = String(row._id);
          const already = row.slug?.includes(`-trash-${id}`);
          return BranchModel.updateOne(
            { _id: row._id },
            {
              $set: {
                deletedAt: new Date(),
                ...(already ? {} : { slug: `${row.slug}-trash-${id}` }),
              },
            }
          );
        })
      );
    } else {
      for (const row of rows) {
        const id = String(row._id);
        const slug = row.slug?.endsWith(`-trash-${id}`)
          ? row.slug.slice(0, -(`-trash-${id}`.length))
          : row.slug;
        const conflict = await BranchModel.findOne({
          deletedAt: null,
          _id: { $ne: row._id },
          slug,
        }).lean();
        if (conflict) {
          return response(false, 400, `Cannot restore "${row.name}" — that slug is already in use.`);
        }
        await BranchModel.updateOne({ _id: row._id }, { $set: { deletedAt: null, slug } });
      }
    }

    return response(true, 200, deleteType === "SD" ? "Data moved into trash." : "Data restored.");
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    if (!Array.isArray(ids) || !ids.length || payload.deleteType !== "PD") {
      return response(false, 400, "Invalid delete operation.");
    }

    await BranchModel.deleteMany({ _id: { $in: ids } });
    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}
