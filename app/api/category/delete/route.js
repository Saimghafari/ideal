import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import mongoose from "mongoose";
import CategoryModel from "@/models/Category.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or empty id list.')
        }

        const category = await CategoryModel.find({ _id: { $in: ids } }).lean()
        if (!category.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delet operation. Delete type should be SD or RSD for this route.')
        }

        if (deleteType === 'SD') {
            const cats = await CategoryModel.find({ _id: { $in: ids } });
            await Promise.all(
                cats.map((cat) => {
                    const id = String(cat._id);
                    const alreadyMarked =
                        cat.slug?.includes(`-trash-${id}`) ||
                        cat.name?.includes(`__trash__${id}`);
                    return CategoryModel.updateOne(
                        { _id: cat._id },
                        {
                            $set: {
                                deletedAt: new Date().toISOString(),
                                ...(alreadyMarked
                                    ? {}
                                    : {
                                          name: `${cat.name}__trash__${id}`,
                                          slug: `${cat.slug}-trash-${id}`,
                                      }),
                            },
                        }
                    );
                })
            );
        } else {
            // Restore: strip trash suffixes, then clear deletedAt
            const cats = await CategoryModel.find({ _id: { $in: ids } });
            for (const cat of cats) {
                const id = String(cat._id);
                const name = cat.name?.endsWith(`__trash__${id}`)
                    ? cat.name.slice(0, -( `__trash__${id}`.length ))
                    : cat.name;
                const slug = cat.slug?.endsWith(`-trash-${id}`)
                    ? cat.slug.slice(0, -( `-trash-${id}`.length ))
                    : cat.slug;

                const conflict = await CategoryModel.findOne({
                    deletedAt: null,
                    _id: { $ne: cat._id },
                    $or: [{ name }, { slug }],
                }).lean();

                if (conflict) {
                    return response(
                        false,
                        400,
                        `Cannot restore "${name}" — an active category already uses this name or slug.`
                    );
                }

                await CategoryModel.updateOne(
                    { _id: cat._id },
                    { $set: { deletedAt: null, name, slug } }
                );
            }
        }


        return response(true, 200, deleteType === 'SD' ? 'Data moved into trash.' : "Data restored.")

    } catch (error) {
        return catchError(error)
    }
}


export async function DELETE(request) {

    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or empty id list.')
        }

        const category = await CategoryModel.find({ _id: { $in: ids } }).lean()
        if (!category.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!deleteType === 'PD') {
            return response(false, 400, 'Invalid delet operation. Delete type should be PD for this route.')
        }

        await CategoryModel.deleteMany({ _id: { $in: ids } })

        return response(true, 200, 'Data deleted permanently')
    } catch (error) {
        return catchError(error)
    }
}