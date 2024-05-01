'use client'
import Input from '@/components/form/input'
import Button from '@/components/form/button'
import { useFormState } from 'react-dom'
import { sms } from './action'

// useFormState의 초기값
const initialState = { token: false, error: undefined }

export default function SmsLogin() {
  const [state, action] = useFormState(sms, initialState)
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">핸드폰 번호를 입력하세요</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {/* 전화번호를 입력해서 valid를 뚫고 토큰을 받았다면 토큰 input이 나옴 */}
        {state.token ? (
          <Input
            name="token"
            placeholder="인증번호"
            required={true}
            type="number"
            min={100000}
            max={999999}
            key={'phone'} // 키 값으로 구분을 해줘야 함.
          />
        ) : (
          /* 최초 입력 시 state.token이 false이기 때문에 전화번호 input이 나옴. */
          <Input
            name="phone"
            placeholder="PhoneNumber"
            required={true}
            type="text"
            errors={state.error?.formErrors}
            key={'token'} // 키 값으로 구분을 해줘야 함.
          />
        )}

        <Button text={state.token ? '로그인' : '토큰받기'} />
      </form>
    </div>
  )
}
