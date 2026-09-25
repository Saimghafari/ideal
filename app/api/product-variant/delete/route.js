import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";

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

        const data = await ProductVariantModel.find({ _id: { $in: ids } })
        if (!data.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delet operation. Delete type should be SD or RSD for this route.')
        }

        if (deleteType === 'SD') {
            await Promise.all(
                data.map((variant) => {
                    const id = String(variant._id)
                    const alreadyMarked = variant.sku?.includes(`-trash-${id}`)
                    return ProductVariantModel.updateOne(
                        { _id: variant._id },
                        {
                            $set: {
                                deletedAt: new Date().toISOString(),
                                ...(alreadyMarked
                                    ? {}
                                    : { sku: `${variant.sku}-trash-${id}` }),
                            },
                        }
                    )
                })
            )
        } else {
            for (const variant of data) {
                const id = String(variant._id)
                const sku = variant.sku?.endsWith(`-trash-${id}`)
                    ? variant.sku.slice(0, -(`-trash-${id}`.length))
                    : variant.sku

                const conflict = await ProductVariantModel.findOne({
                    deletedAt: null,
                    _id: { $ne: variant._id },
                    sku,
                }).lean()

                if (conflict) {
                    return response(
                        false,
                        400,
                        `Cannot restore — an active variant already uses the SKU "${sku}".`
                    )
                }

                await ProductVariantModel.updateOne(
                    { _id: variant._id },
                    { $set: { deletedAt: null, sku } }
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

        const data = await ProductVariantModel.find({ _id: { $in: ids } }).lean()
        if (!data.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!deleteType === 'PD') {
            return response(false, 400, 'Invalid delet operation. Delete type should be PD for this route.')
        }

        await ProductVariantModel.deleteMany({ _id: { $in: ids } })

        return response(true, 200, 'Data deleted permanently')
    } catch (error) {
        return catchError(error)
    }
}
