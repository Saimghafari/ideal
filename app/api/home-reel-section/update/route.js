import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import HomeReelSectionModel from "@/models/HomeReelSection.model";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

const reelSchema = z.object({
  productSlug: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  videoUrl: z.string().min(8, "Video URL is required."),
  posterMedia: z.string().optional().nullable(),
  posterUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

const schema = z.object({
  placement: z.enum(["after_men", "after_women"]),
  reels: z.array(reelSchema).min(1, "Add at least one video."),
});

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const data = validate.data;
    const updated = await HomeReelSectionModel.findOneAndUpdate(
      { placement: data.placement },
      {
        $set: {
          reels: data.reels.map((reel) => ({
            productSlug: reel.productSlug || "",
            product:
              reel.productId && isValidObjectId(reel.productId)
                ? reel.productId
                : null,
            videoUrl: reel.videoUrl.trim(),
            poster: reel.posterMedia || null,
            posterUrl: reel.posterUrl || "",
            isActive: reel.isActive !== false,
          })),
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return response(true, 200, "Videos updated successfully.", updated);
  } catch (error) {
    return catchError(error);
  }
}
