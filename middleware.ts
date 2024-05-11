import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

// 로그인 없이도 들어갈 수 있는 페이지
// 존재 유무를 확인하기에는 배열보다는 object가 좋음
const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/create-account": true,
  "/sms": true,
  "/github/start": true,
  "/github/complete": true,
};

// 함수 명은 무조건 middleware여야 함.
export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exist = publicOnlyUrls[request.nextUrl.pathname];
  // 비로그인 상태로 로그인 해야하는 곳에 들어왔을 경우
  if (!session.id) {
    if (!exist) {
      console.log("넌 로그인 안해서 오면안돼!");

      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  // 로그인 한 유저라면 로그인, 회원가입, sms 로그인 페이지로는 진입 못하게 해야함
  else {
    if (exist) {
      console.log("넌 로그인해서 오면 안돼");

      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }
}

// 오브젝트의 명은 무조건 config여야 한다.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
