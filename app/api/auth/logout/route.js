import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";
import { accessTokenCookieOptions, cookieScopeFromHeaders } from "@/lib/authSession";

export async function POST(request) {
    try {
        await connectDB()
        const cookieStore = await cookies()
        const scope = await cookieScopeFromHeaders()
        cookieStore.set({
            ...accessTokenCookieOptions({ maxAge: 0, ...scope }),
            value: "",
        })
        return response(true, 200, 'Logout successfull.')
    } catch (error) {
        catchError(error)
    }
}