import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

async function freeTrashedNameAndSlug(name, slug) {
  const trashed = await CategoryModel.find({
    deletedAt: { $ne: null },
    $or: [{ name }, { slug }],
  });

  for (const doc of trashed) {
    await CategoryModel.updateOne(
      { _id: doc._id },
      {
        $set: {
          name: `${doc.name}__trash__${doc._id}`,
          slug: `${doc.slug}-trash-${doc._id}`,
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    // Migrate off legacy full unique indexes when present
    try {
      await CategoryModel.syncIndexes();
    } catch {
      // ignore index sync errors; freeTrashedNameAndSlug still unblocks creates
    }

    const payload = await request.json();

    const schema = zSchema.pick({
      name: true,
      slug: true,
      categoryMedia: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const { name, slug, categoryMedia } = validate.data;
    const shortDescription = String(payload.shortDescription ?? "")
      .trim()
      .slice(0, 200);

    const activeDuplicate = await CategoryModel.findOne({
      deletedAt: null,
      $or: [{ name }, { slug }],
    }).lean();

    if (activeDuplicate) {
      const field = activeDuplicate.name === name ? "name" : "slug";
      return response(
        false,
        400,
        `A category with this ${field} already exists.`
      );
    }

    // Soft-deleted rows may still hold the old unique index
    await freeTrashedNameAndSlug(name, slug);

    const newCategory = new CategoryModel({
      name,
      slug,
      shortDescription,
      media: categoryMedia || null,
    });

    await newCategory.save();

    return response(true, 200, "Category added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
