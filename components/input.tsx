import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  errors = [],
  name,
  ...rest
}: Readonly<InputProps & InputHTMLAttributes<HTMLInputElement>>) {
  //console.log({ rest })
  return (
    <div className="flex flex-col gap-2">
      <input
        className="fotransition-transform h-10 w-full rounded-md border-none bg-transparent p-2 ring-1 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-orange-500"
        name={name}
        {...rest}
      />
      {errors.map((error, idx: number) => {
        return (
          <span key={idx} className="font-medium text-red-500">
            {error}
          </span>
        );
      })}
    </div>
  );
}
