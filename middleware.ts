import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based routing restrictions could go here, but since the mock MVP allows any role to view any dashboard (with a "role mismatch" warning), we'll just require authentication.
    // If you want strict route protection:
    // if (path.startsWith("/dashboard") && token.role !== "citizen") return NextResponse.redirect(new URL("/", req.url));
    // if (path.startsWith("/ngo") && token.role !== "ngo") return NextResponse.redirect(new URL("/", req.url));
    // if (path.startsWith("/volunteer") && token.role !== "volunteer") return NextResponse.redirect(new URL("/", req.url));

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/ngo/:path*", "/volunteer/:path*", "/tracking/:path*"],
};
