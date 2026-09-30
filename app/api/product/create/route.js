import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import { encode } from "entities"
import { isValidObjectId } from "mongoose"
import { cleanNutritionRows } from "@/lib/nutritionRows"

async function freeTrashedSlug(slug) {
    const trashed = await ProductModel.find({
        deletedAt: { $ne: null },
        slug,
    })

    for (const doc of trashed) {
        await ProductModel.updateOne(
            { _id: doc._id },
            {
                $set: {
                    slug: `${doc.slug}-trash-${doc._id}`,
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
            await ProductModel.syncIndexes()
        } catch {
            // ignore — freeTrashedSlug still unblocks creates
        }

        const payload = await request.json()

        const schema = zSchema.pick({
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

        const productData = validate.data

        const activeDuplicate = await ProductModel.findOne({
            deletedAt: null,
            slug: productData.slug,
        }).lean()

        if (activeDuplicate) {
            return response(false, 400, 'A product with this slug already exists.')
        }

        await freeTrashedSlug(productData.slug)

        const newProduct = new ProductModel({
            name: productData.name,
            slug: productData.slug,
            category: productData.category,
            mrp: Number(productData.mrp),
            sellingPrice: Number(productData.sellingPrice),
            mrpPkr: Number(productData.mrpPkr ?? 0),
            sellingPricePkr: Number(productData.sellingPricePkr ?? 0),
            discountPercentage: Number(productData.discountPercentage),
            discountPercentagePkr: Number(productData.discountPercentagePkr ?? 0),
            description: encode(productData.description),
            media: productData.media,
            deliverable: payload.deliverable !== false,
            todayOnly: payload.todayOnly === true,
            featured: payload.featured === true,
            branches: Array.isArray(payload.branches)
                ? payload.branches.filter((id) => isValidObjectId(id))
                : [],
            ingredientsNote: String(payload.ingredientsNote || "").trim(),
            ingredients: String(payload.ingredientsText || "")
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            nutrition: cleanNutritionRows(payload.nutritionRows),
        })

        await newProduct.save()

        return response(true, 200, 'Product added successfully.')

    } catch (error) {
        return catchError(error)
    }
}
