import { NextResponse } from "next/server";

export default function middleware(request: any) {
  // Simple test middleware that just logs and continues
  console.log("Middleware running for:", request.url);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
