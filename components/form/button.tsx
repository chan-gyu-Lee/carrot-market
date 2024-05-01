'use client'
import { useFormStatus } from 'react-dom'

interface ButtonProps {
  text: string
}

export default function Button({ text }: Readonly<ButtonProps>) {
  const { pending } = useFormStatus()
  console.log({ pending })

  return (
    <button disabled={pending} className="primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-500">
      {pending ? 'Loading...' : text}
    </button>
  )
}
