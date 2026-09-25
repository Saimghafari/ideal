import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";
import { accessTokenCookieOptions } from "@/lib/authSession";

export async function POST(request) {
    try {
        await connectDB()
        const cookieStore = await cookies()
        cookieStore.set({
            ...accessTokenCookieOptions({ maxAge: 0 }),
            value: "",
        })
        return response(true, 200, 'Logout successfull.')
    } catch (error) {
        catchError(error)
    }
}