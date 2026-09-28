import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();

    const schema = zSchema.pick({
      _id: true,
      name: true,
      slug: true,
      categoryMedia: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error);
    }

    const { _id, name, slug, categoryMedia } = validate.data;
    const shortDescription = String(payload.shortDescription ?? "")
      .trim()
      .slice(0, 200);
    const parentId = String(payload.parent || "").trim();
    let parent = null;
    if (parentId) {
      if (parentId === String(_id)) {
        return response(false, 400, "A category cannot be its own parent.");
      }
      parent = await CategoryModel.findOne({
        _id: parentId,
        deletedAt: null,
        parent: null,
      }).lean();
      if (!parent) {
        return response(false, 400, "Choose a main category as the parent.");
      }
      const childCount = await CategoryModel.countDocuments({
        deletedAt: null,
        parent: _id,
      });
      if (childCount > 0) {
        return response(false, 400, "Move its subcategories before making this a subcategory.");
      }
    }

    const updated = await CategoryModel.findOneAndUpdate(
      { deletedAt: null, _id },
      {
        $set: {
          name,
          slug,
          shortDescription,
          media: categoryMedia || null,
          parent: parent ? parent._id : null,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return response(false, 404, "Data not found.");
    }

    return response(true, 200, "Category updated successfully.", {
      shortDescription: updated.shortDescription,
    });
  } catch (error) {
    return catchError(error);
  }
}
