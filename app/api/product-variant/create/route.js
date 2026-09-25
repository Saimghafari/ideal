import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductVariantModel from "@/models/ProductVariant.model"

async function freeTrashedSku(sku) {
    const trashed = await ProductVariantModel.find({
        deletedAt: { $ne: null },
        sku,
    })

    for (const doc of trashed) {
        await ProductVariantModel.updateOne(
            { _id: doc._id },
            {
                $set: {
                    sku: `${doc.sku}-trash-${doc._id}`,
                },
            }
        )
    }
}

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        try {
            await ProductVariantModel.syncIndexes()
        } catch {
            // ignore
        }

        const payload = await request.json()

        const schema = zSchema.pick({
            product: true,
            sku: true,
            color: true,
            size: true,
            mrp: true,
            sellingPrice: true,
            mrpPkr: true,
            sellingPricePkr: true,
            discountPercentage: true,
            discountPercentagePkr: true,
            media: true
        })


        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const variantData = validate.data

        const activeDuplicate = await ProductVariantModel.findOne({
            deletedAt: null,
            sku: variantData.sku,
        }).lean()

        if (activeDuplicate) {
            return response(false, 400, 'A product variant with this SKU already exists.')
        }

        await freeTrashedSku(variantData.sku)

        const newProductVariant = new ProductVariantModel({
            product: variantData.product,
            color: variantData.color || "Default",
            size: variantData.size,
            sku: variantData.sku,
            mrp: variantData.mrp,
            sellingPrice: variantData.sellingPrice,
            mrpPkr: variantData.mrpPkr ?? 0,
            sellingPricePkr: variantData.sellingPricePkr ?? 0,
            discountPercentage: variantData.discountPercentage,
            discountPercentagePkr: variantData.discountPercentagePkr ?? 0,
            media: variantData.media,
        })

        await newProductVariant.save()

        return response(true, 200, 'Product Variant added successfully.')

    } catch (error) {
        return catchError(error)
    }
}
