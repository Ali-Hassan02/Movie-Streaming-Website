import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import * as cookie from 'cookie';

export async function middleware(req) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = cookieHeader ? cookie.parse(cookieHeader) : {};
  const token = cookies.token; // Get token from cookies

  // If no token is found, redirect to login page
  if (!token) {
    // Store the current URL in the redirect query parameter
    const url = req.nextUrl.clone();
    url.pathname = '/login'; // Set the path to /login
    url.searchParams.set('redirect', req.nextUrl.pathname); // Add the current path as redirect param

    return NextResponse.redirect(url); // Redirect to login with redirect query
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret); // Verify the token
    console.log("Token verified successfully");
    return NextResponse.next();  // Allow the request to proceed if token is valid
  } catch (error) {
    console.log("Token verification failed:", error);
    // Redirect to login if token is invalid
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', req.nextUrl.pathname); // Add the current path as redirect param
    return NextResponse.redirect(url); // Redirect to login with redirect query
  }
}

export const config = {
  matcher: ['/FavouriteList'],  // Protect the /api/Favourite route (and sub-routes)
};
//'/Favourite/:path*', '/movie/:path*' , '/watch/:path*'