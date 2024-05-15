"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./action";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";

const MAX_FILE_SIZE = 1024 * 1024 * 2;

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [state, action] = useFormState(uploadProduct, null);
  const { register, handleSubmit } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  // 사진 용량 체크
  const checkFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      alert("사진 용량은 3mb 까지 가능합니다.");
      return true;
    }

    return false;
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    const files = event.target.files;
    if (!files) {
      return;
    }
    const file = files[0];
    // 파일 타입 체크 (JPG, JPEG, PNG만 허용)
    if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
      alert("JPG, JPEG, PNG 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 사이즈 체크
    if (checkFileSize(file)) return;

    // url을 생성하는 메소드, 브라우저에만 존재하고 다른사람은 볼수 없음.
    // 파일이 브라우저의 메모리에 업로드되었고, 페이지 새로고침 전까지 메모리에 저장되어있음.
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  return (
    <div>
      <form action={action} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          // bg-center : 정중앙으로 오게함, bg-cover : 사이즈 맞춤
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*" // 이미지 파일만 받기
          className="hidden"
        />
        <Input
          //   required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={state?.fieldErrors.title}
        />
        <Input
          {...register("price")}
          // required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          {...register("description")}
          // required
          placeholder="설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="등록" />
      </form>
    </div>
  );
}
