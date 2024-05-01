"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => {
  return !username.includes("오리");
};

const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  console.log(password, confirmPassword);

  return password === confirmPassword;
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "숫자 안됨",
        required_error: "필수입력사항",
      })
      .trim() // 공백 제거
      .toLowerCase() // 소문자 변환
      //   .transform((username) => `🦆${username}`) // 데이터 값을 변경시켜줌
      .refine(checkUsername, "이름에 오리가 들어가면 안돼"),
    email: z.string().email().toLowerCase(),

    password: z.string().min(PASSWORD_MIN_LENGTH),
    // 비밀번호 정규식
    //   .regex(PASSWORD_REGEX, "영어, 특문, 숫자 있어야 됨"),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  // form 전체에 대한 vaild지만 메시지와 path를 지정해서 특정 form에 에러 메시지를 줄 수 있다.

  .superRefine(async (data, ctx) => {
    const user = await db.user.findUnique({
      where: { username: data.username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 username입니다.",
        path: ["username"],
        // 치명적인 이슈임을 선언
        fatal: true,
      });
      // fatal : true이고, return z.NEVER를 하면 superRefine 밑에 있는 일반 refine은 작동하지 않음.
      return z.NEVER;
    }
  })
  .superRefine(async (data, ctx) => {
    const user = await db.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 email입니다.",
        path: ["email"],
        // 치명적인 이슈임을 선언
        fatal: true,
      });
      // fatal : true이고, return z.NEVER를 하면 superRefine 밑에 있는 일반 refine은 작동하지 않음.
      return z.NEVER;
    }
  })
  .refine(checkPassword, { message: "비번이 다름", path: ["password"] });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = await formSchema.safeParseAsync(data);

  // 양식에 안맞음
  if (!result.success) {
    return result.error.flatten();
  } // 양식에 맞음
  else {
    /* username, email zod에서 vaild 검사  */
    // password 해쉬 12는 12번 라운드를 돌린다.
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // db에 저장
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    // 해당 session을 저장한다.
    await session.save();
    console.log(user);
    // /home으로 리다이렉트
    redirect("/profile");
  }
}
