import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

// 함수 명은 무조건 middleware여야 함.
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("hello");

  /*   if (pathname === "/") {
    const response = NextResponse.next();
    response.cookies.set("middleware-cookie", "hello");
    return response;
  }
  if (pathname === "/profile") {
    return Response.redirect(new URL("/", request.url));
  } */
}

// 오브젝트의 명은 무조건 config여야 한다.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
