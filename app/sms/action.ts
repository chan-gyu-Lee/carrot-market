'use server'
import { z } from 'zod'
import validator from 'validator'
import { redirect } from 'next/navigation'

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'), '번호확인해라')
const tokenSchema = z.coerce.number().min(100000, '너무적다').max(999999, '너무높다')

interface ActionState {
  token: boolean
}

export async function sms(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone')
  const token = formData.get('token')

  // 전화번호만 입력한 상황
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone)
    // 번호 형식에 안맞으면 토큰을 안줌
    if (!result.success) {
      return { token: false, error: result.error.flatten() }
    } else {
      // 번호 형식에 맞으면 토큰 입력칸을 줌.#
      return { token: true }
    }
    // 전화번호 입력 후 토큰을 입력해야 함.
  } else {
    const result = tokenSchema.safeParse(token)
    // 토큰이 형식에 맞지 않으면 그냥 토큰 쓰는 칸을 두고 에러를 발생시킴
    if (!result.success) {
      return { token: true, error: result.error.flatten() }
    } else {
      // 토큰까지 성공하면 로그인 성공이므로 홈화면으로 이동

      redirect('/')
    }
  }
}
