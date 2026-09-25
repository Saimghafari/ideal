import { z } from 'zod'
import { normalizeSlug } from '@/lib/normalizeSlug'

export const zSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),

    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be at most 50 characters" }),
    otp: z.string().regex(/^\d{6}$/, {
        message: "OTP must be a 6-digit number",
    }),
    _id: z.string().min(3, '_id is required.'),
    alt: z.string().min(3, 'Alt is required.'),
    title: z.string().min(3, 'Title is required.'),
    slug: z
        .string()
        .min(1, 'Slug is required.')
        .transform((val) => normalizeSlug(val))
        .refine((val) => val.length >= 3, { message: 'Slug must be at least 3 characters.' }),
    shortDescription: z
        .string()
        .max(200, { message: 'Short description must be at most 200 characters' }),

    category: z.string().min(3, 'Category is required.'),
    mrp: z.union([
        z.number().positive('Expected positive value, received negative.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),
    sellingPrice: z.union([
        z.number().positive('Expected positive value, received negative.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),
    mrpPkr: z.union([
        z.number().min(0, 'Expected non-negative value.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]).optional().default(0),
    sellingPricePkr: z.union([
        z.number().min(0, 'Expected non-negative value.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]).optional().default(0),
    discountPercentage: z.union([
        z.number().positive('Expected positive value, received negative.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),
    discountPercentagePkr: z.union([
        z.number().min(0, 'Expected non-negative value.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]).optional().default(0),
    description: z.string().min(3, 'Description is required.'),
    media: z.array(z.string()),
    /** Optional single media id for category cover image */
    categoryMedia: z.string().optional().nullable(),
    product: z.string().min(3, 'Product is required.'),
    color: z.string().optional().default("Default"),
    size: z.string().min(1, 'Size is required.'),
    sku: z.string().min(3, 'SKU is required.'),
    code: z.string().min(3, 'Code is required.'),
    amount: z.union([
        z.number().positive('Expected positive value, received negative.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),
    minShoppingAmount: z.union([
        z.number().positive('Expected positive value, received negative.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),
    validity: z.coerce.date(),
    userId: z.string().min(3, 'User id is required.'),
    rating: z.union([
        z.number().positive('Expected positive value, received negative.'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),
    review: z.string().min(3, 'Review is required.'),
    code: z.string().min(3, 'Coupon code is required.'),
    phone: z.string().min(10, 'Phone number is required.'),
    country: z.string().min(3, 'Country is required.'),
    state: z.string().min(3, 'State is required.'),
    city: z.string().min(3, 'City is required.'),
    pincode: z.string().min(3, 'Pincode is required.'),
    landmark: z.string().min(3, 'Landmark is required.'),
    ordernote: z.string().optional(),
    address: z.string().min(3, 'Address is required.'),
})