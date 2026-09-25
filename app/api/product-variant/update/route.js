import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductVariantModel from "@/models/ProductVariant.model"

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            _id: true,
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

        const validatedData = validate.data

        const updated = await ProductVariantModel.findOneAndUpdate(
            { deletedAt: null, _id: validatedData._id },
            {
                $set: {
                    product: validatedData.product,
                    color: validatedData.color || "Default",
                    size: validatedData.size,
                    sku: validatedData.sku,
                    mrp: Number(validatedData.mrp),
                    sellingPrice: Number(validatedData.sellingPrice),
                    mrpPkr: Number(validatedData.mrpPkr ?? 0),
                    sellingPricePkr: Number(validatedData.sellingPricePkr ?? 0),
                    discountPercentage: Number(validatedData.discountPercentage),
                    discountPercentagePkr: Number(validatedData.discountPercentagePkr ?? 0),
                    media: validatedData.media,
                },
            },
            { new: true, runValidators: true }
        )

        if (!updated) {
            return response(false, 404, 'Data not found.')
        }

        return response(true, 200, 'Product variant updated successfully.')

    } catch (error) {
        return catchError(error)
    }
}
