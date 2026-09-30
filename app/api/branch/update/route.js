import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { normalizeSlug } from "@/lib/normalizeSlug";
import BranchModel from "@/models/Branch.model";
import { z } from "zod";

const schema = z.object({
  _id: z.string().min(3),
  name: z.string().min(2).max(80),
  slug: z.string().min(3),
  shortName: z.string().max(40).optional().default(""),
  address: z.string().min(3).max(180),
  hours: z.string().max(80).optional().default(""),
  summary: z.string().max(400).optional().default(""),
  phone: z.string().max(30).optional().default(""),
  prepMinutes: z.coerce.number(),
  isActive: z.boolean().optional(),
  media: z.string().optional().nullable(),
});

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    const payload = await request.json();
    const validate = schema.safeParse({
      ...payload,
      slug: normalizeSlug(payload.slug || payload.name || ""),
      prepMinutes: Number(payload.prepMinutes) === 10 ? 10 : 20,
    });
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const data = validate.data;
    const duplicate = await BranchModel.findOne({
      deletedAt: null,
      _id: { $ne: data._id },
      slug: data.slug,
    }).lean();
    if (duplicate) return response(false, 400, "A branch with this slug already exists.");

    const updated = await BranchModel.findOneAndUpdate(
      { _id: data._id, deletedAt: null },
      {
        $set: {
          name: data.name,
          slug: data.slug,
          shortName: data.shortName || data.name,
          address: data.address,
          hours: data.hours || "",
          summary: data.summary || "",
          phone: data.phone || "",
          prepMinutes: data.prepMinutes,
          isActive: data.isActive !== false,
          media: data.media || null,
        },
      },
      { new: true }
    );

    if (!updated) return response(false, 404, "Branch not found.");
    return response(true, 200, "Branch updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
