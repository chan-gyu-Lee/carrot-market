import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  return await getIronSession<SessionContent>(cookies(), {
    cookieName: "carrot", // 쿠키 이름
    password: process.env.COOKIE_PASSWORD!, // 쿠키를 암호화하기 위한 비밀번호 , !는 .env안에 무조건 있다는 의미
  });
}
