"use server";
import { z } from "zod";
import twilio from "twilio";
import { redirect } from "next/navigation";
import validator from "validator";
import db from "@/lib/db";
import crypto from "crypto";
import getLogin from "@/lib/login";
const tokenExists = async (token: number) => {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token + "",
    },
    select: {
      id: true,
    },
  });

  return Boolean(exists);
};

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"), "번호확인해라");
const tokenSchema = z.coerce
  .number()
  .min(100000, "너무적다")
  .max(999999, "너무높다")
  .refine(tokenExists, "토큰이 존재하지 않습니다.");

interface ActionState {
  token: boolean;
}

// token 만들기
async function getToken() {
  // 랜덤한 값을 줌
  const token = crypto.randomInt(100000, 999999).toString();
  // 혹시 랜덤한 값이 겹칠수도 있으니 확인해야 함.
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token,
    },
    select: {
      id: true,
    },
  });
  // 재귀함수로 토큰값이 존재하면 다시 실행
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

export async function sms(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  // 전화번호만 입력한 상황
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    // 번호 형식에 안맞으면 토큰을 안줌
    if (!result.success) {
      return { token: false, error: result.error.flatten() };
    } else {
      // db에서 이전에 있던 토큰을 삭제한다.
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // 새 토큰을 만들어서 db에 저장
      const token = await getToken();
      // smsToken db에 연결
      await db.sMSToken.create({
        data: {
          // token을 넣을 건데
          token: token,
          // user랑 연결 시킬 것
          user: {
            // 근데 연결하거나 없으면 user를 생성
            connectOrCreate: {
              // 여기에 연결하거나
              where: {
                phone: result.data,
              },
              // 생성하거나
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      // twilio를 사용해서 유저에게 sms 토큰을 보낸다.
      /*  const client = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body: `carrot 토큰 : ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        // 원래는 result.data를 넣어서 입력한 사람한테 보내야 되는데 그게 안되니까 그냥 나한테 보냄
        to: process.env.MY_PHONE_NUMBER!,
      }); */
      // 번호 형식에 맞으면 토큰 입력칸을 줌.#
      return { token: true };
    }
    // 전화번호 입력 후 토큰을 입력해야 함.
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    // 토큰이 형식에 맞지 않으면 그냥 토큰 쓰는 칸을 두고 에러를 발생시킴
    if (!result.success) {
      return { token: true, error: result.error.flatten() };
    } else {
      // 토큰을 입력하면 해당 토큰의 userId를 가져와야 함.
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      // 로그인과 동시에 로그인에 사용한 토큰 삭제하기
      await getLogin(token!.userId, token!.id);
      // useFormState는 무조건 리턴이 있던가 redirect를 해야함
      redirect("/profile");
    }
  }
}
