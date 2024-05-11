import db from "@/lib/db";
import getLogin from "@/lib/login";

import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

const getAccessToken = async (code: string) => {
  const accessTokenUrl = "https://github.com/login/oauth/access_token";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code: code,
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${accessTokenUrl}?${formattedParams}`;

  const { error, access_token } = await (
    await fetch(finalURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if (error) {
    return new Response(null, { status: 400 });
  }

  return access_token;
};

interface IProfileResponseData {
  id: string;
  avatar_url: string;
  login: string;
}

const checkExistsUser = async (access_token: string) => {
  const profileResponseData: IProfileResponseData = await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    })
  ).json();

  return profileResponseData;
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  // 코드가 없으면 404 페이지로 이동
  if (!code) {
    return notFound();
  }
  const access_token = await getAccessToken(code);

  // 필요한 것만 꺼내기
  const { id, avatar_url, login } = await checkExistsUser(access_token);

  // db에서 해당 user가 존재하는지 찾기
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  // 계정이 있다면 로그인을 하는 것이지 회원가입이 아니니까 db에 저장 x
  if (user) {
    await getLogin(user.id);
  }

  // 계정이 없다면 db 저장 -> id, password로 회원가입한 사람의 username과 겹칠 수 있는데 그걸 해결해야함.
  const newUser = await db.user.create({
    data: {
      username: login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  await getLogin(newUser.id);
}
