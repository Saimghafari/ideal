import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import HomeGenderCollectionModel from "@/models/HomeGenderCollection.model";
import { z } from "zod";

const itemSchema = z.object({
  key: z.string().optional(),
  title: z.string().min(1, "Item title is required."),
  href: z.string().min(1, "Item link is required."),
  media: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
});

const schema = z.object({
  key: z.enum(["men", "women"]),
  title: z.string().min(2, "Title is required."),
  href: z.string().min(1, "Link is required."),
  featuredMedia: z.string().optional().nullable(),
  featuredUrl: z.string().optional().nullable(),
  featuredAlt: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, "Add at least one category card."),
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
    const updated = await HomeGenderCollectionModel.findOneAndUpdate(
      { key: data.key },
      {
        $set: {
          title: data.title.trim(),
          href: data.href.trim(),
          featuredMedia: data.featuredMedia || null,
          featuredUrl: data.featuredUrl || "",
          featuredAlt: data.featuredAlt || "",
          items: data.items.map((item, index) => ({
            key: item.key || `${data.key}-${index}`,
            title: item.title.trim(),
            href: item.href.trim(),
            image: item.media || null,
            url: item.url || "",
            alt: item.alt || item.title,
          })),
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return response(true, 200, "Collection updated successfully.", updated);
  } catch (error) {
    return catchError(error);
  }
}
