import { redirect } from "next/navigation";

export function GET() {
  console.log("github get!!!!");
  // 공식문서에 나옴
  const baseURL = "https://github.com/login/oauth/authorize";

  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email", // 사용자에게 받을 정보들, 엄청 많으니 공식문서 참조
    allow_signup: "true",
  };

  // string 타입만 들어갈 수 있으므로 env 파일은 무조건 있다는 ! 표시해주고, boolean도 string으로 바꿈
  // 또한 현재는 object 타입이므로 url에 들어갈 수 있게 toString()으로 변경해 줌.
  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${baseURL}?${formattedParams}`;
  console.log("formattedParams -> ", formattedParams);
  console.log("finalURL -> ", finalURL);
  return redirect(finalURL);
}
