import { redirect } from "next/navigation";
import getSession from "./session";
import db from "./db";

export default async function getLogin(userId: number, smsTokenId?: number) {
  const session = await getSession();
  session.id = userId;
  await session.save();

  // sms 로그인에서만 사용하는 용도
  if (smsTokenId) {
    await db.sMSToken.delete({
      where: {
        id: smsTokenId,
      },
    });
  }
  return redirect("/profile");
}
