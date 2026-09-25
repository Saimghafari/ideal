import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";

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

        const data = await ProductModel.find({ _id: { $in: ids } })
        if (!data.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delet operation. Delete type should be SD or RSD for this route.')
        }

        if (deleteType === 'SD') {
            await Promise.all(
                data.map((product) => {
                    const id = String(product._id)
                    const alreadyMarked = product.slug?.includes(`-trash-${id}`)
                    return ProductModel.updateOne(
                        { _id: product._id },
                        {
                            $set: {
                                deletedAt: new Date().toISOString(),
                                ...(alreadyMarked
                                    ? {}
                                    : { slug: `${product.slug}-trash-${id}` }),
                            },
                        }
                    )
                })
            )
        } else {
            for (const product of data) {
                const id = String(product._id)
                const slug = product.slug?.endsWith(`-trash-${id}`)
                    ? product.slug.slice(0, -(`-trash-${id}`.length))
                    : product.slug

                const conflict = await ProductModel.findOne({
                    deletedAt: null,
                    _id: { $ne: product._id },
                    slug,
                }).lean()

                if (conflict) {
                    return response(
                        false,
                        400,
                        `Cannot restore — an active product already uses the slug "${slug}".`
                    )
                }

                await ProductModel.updateOne(
                    { _id: product._id },
                    { $set: { deletedAt: null, slug } }
                )
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

        const data = await ProductModel.find({ _id: { $in: ids } }).lean()
        if (!data.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!deleteType === 'PD') {
            return response(false, 400, 'Invalid delet operation. Delete type should be PD for this route.')
        }

        await ProductModel.deleteMany({ _id: { $in: ids } })

        return response(true, 200, 'Data deleted permanently')
    } catch (error) {
        return catchError(error)
    }
}
