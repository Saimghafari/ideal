import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import { encode } from "entities"

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
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            mrpPkr: true,
            sellingPricePkr: true,
            discountPercentage: true,
            discountPercentagePkr: true,
            description: true,
            media: true
        })
        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const validatedData = validate.data

        const updated = await ProductModel.findOneAndUpdate(
            { deletedAt: null, _id: validatedData._id },
            {
                $set: {
                    name: validatedData.name,
                    slug: validatedData.slug,
                    category: validatedData.category,
                    mrp: Number(validatedData.mrp),
                    sellingPrice: Number(validatedData.sellingPrice),
                    mrpPkr: Number(validatedData.mrpPkr ?? 0),
                    sellingPricePkr: Number(validatedData.sellingPricePkr ?? 0),
                    discountPercentage: Number(validatedData.discountPercentage),
                    discountPercentagePkr: Number(validatedData.discountPercentagePkr ?? 0),
                    description: encode(validatedData.description),
                    media: validatedData.media,
                },
            },
            { new: true, runValidators: true }
        )

        if (!updated) {
            return response(false, 404, 'Data not found.')
        }

        return response(true, 200, 'Product updated successfully.', {
            mrpPkr: updated.mrpPkr,
            sellingPricePkr: updated.sellingPricePkr,
            discountPercentagePkr: updated.discountPercentagePkr,
        })

    } catch (error) {
        return catchError(error)
    }
}
