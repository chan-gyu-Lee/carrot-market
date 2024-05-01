'use client'

import Input from '@/components/form/input'
import Button from '@/components/form/button'
import SocialLogin from '@/components/form/social-login'
import { useFormState } from 'react-dom'
import { login } from './action'
import { PASSWORD_MIN_LENGTH } from '@/lib/constants'

export default function Login() {
  const [state, action] = useFormState(login, null)

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Login with email and password</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input name="email" placeholder="Email" required={true} type="email" errors={state?.fieldErrors.email} />
        <Input
          name="password"
          placeholder="passowrd"
          required={true}
          type="password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Button text="Login" />
      </form>

      <SocialLogin />
    </div>
  )
}
