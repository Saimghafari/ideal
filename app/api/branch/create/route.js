import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { normalizeSlug } from "@/lib/normalizeSlug";
import BranchModel from "@/models/Branch.model";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(3),
  shortName: z.string().max(40).optional().default(""),
  address: z.string().min(3).max(180),
  hours: z.string().max(80).optional().default(""),
  summary: z.string().max(400).optional().default(""),
  phone: z.string().max(30).optional().default(""),
  prepMinutes: z.coerce.number().refine((value) => value === 10 || value === 20),
  isActive: z.boolean().optional().default(true),
  media: z.string().optional().nullable(),
});

async function freeTrashedSlug(slug) {
  const trashed = await BranchModel.find({ deletedAt: { $ne: null }, slug });
  for (const doc of trashed) {
    await BranchModel.updateOne(
      { _id: doc._id },
      { $set: { slug: `${doc.slug}-trash-${doc._id}` } }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    try {
      await BranchModel.syncIndexes();
    } catch {
      // trash slug rewrite still unblocks creates
    }

    const payload = await request.json();
    const validate = schema.safeParse({
      ...payload,
      slug: normalizeSlug(payload.slug || payload.name || ""),
      prepMinutes: Number(payload.prepMinutes) === 10 ? 10 : 20,
      isActive: payload.isActive !== false,
    });
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const data = validate.data;
    const duplicate = await BranchModel.findOne({ deletedAt: null, slug: data.slug }).lean();
    if (duplicate) return response(false, 400, "A branch with this slug already exists.");

    await freeTrashedSlug(data.slug);

    await BranchModel.create({
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
    });

    return response(true, 200, "Branch added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
