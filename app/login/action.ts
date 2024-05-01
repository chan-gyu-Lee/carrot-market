"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

// 1. zod로 email이 유효한지 확인.
const checkUserEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  // 여기서는 email이 있어야 로그인할 수 있음.
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkUserEmail, "알맞은 이메일이 아닙니다."),
  password: z.string().min(PASSWORD_MIN_LENGTH), //.regex(PASSWORD_REGEX, '영어 대소문자, 숫자, 특문'),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // email로 유저 찾기
    // 2. email이 유효하다면 그 email로 db를 조회해서 암호화된 패스워드와 id(pk)를 가져옴.
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    // 3. 평문 password와  db 패스워드가 일치한다면 session을 생성함.
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    console.log({ ok });

    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      // 로그인하기 -> redirect("/profile")
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["잘못된 비밀번호입니다."],
          email: [],
        },
      };
    }
  }
};
