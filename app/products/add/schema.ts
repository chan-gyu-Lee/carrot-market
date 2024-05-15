import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "사진은 필수에요",
  }),
  title: z
    .string({
      required_error: "제목은 필수에요",
    })
    .trim(),
  description: z
    .string({
      required_error: "설명은 필수에요",
    })
    .trim(),
  price: z.coerce.number({
    required_error: "가격은 필수에요",
  }),
});

// 스키마의 타입을 가져올 수 있음
export type ProductType = z.infer<typeof productSchema>;
