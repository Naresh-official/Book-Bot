import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Define paths that should be accessible to everyone (unauthenticated and authenticated)
    const publicPaths = ["/", "/login", "/signup"];

    // Redirect to dashboard if an authenticated user tries to access login or signup pages
    if (token && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect to login if an unauthenticated user tries to access a protected route
    if (!token && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow the request if it's a public path or the user is authenticated
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
