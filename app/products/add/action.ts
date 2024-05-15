"use server";

// file system 위한 node.js라이브러리
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  console.log(data);

  if (data.photo instanceof File) {
    // public 폴더에 임시로 저장
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    // 현재 넘어오는 photo는 file형태이므로 string 타입으로 변경해줘야 함.
    data.photo = `/${data.photo.name}`;
  }

  const result = productSchema.safeParse(data);
  console.log("이거", result.success);
  if (!result.success) {
    console.log(result.error.flatten());

    return result.error.flatten();
  } else {
    // 어떤 유저가 물건을 올리는 지 알아야 함.
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      // 페이지로 넘기기
      redirect(`/products/${product.id}`);
    }
  }
}
