// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import * as cookie from 'cookie';

export async function middleware(req) {
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? cookie.parse(cookieHeader) : {};
    const token = cookies.token;
    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        console.log("Token verified successfully");
        return NextResponse.next();  
    } catch (error) {
        console.log("Token verification failed:", error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}
export const config = {
    matcher: ['/dashboard', '/actor','/director', '/movie', '/producer'], 
};
