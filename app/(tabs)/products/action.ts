"use server";
import db from "@/lib/db";

export async function getMoreProducts(totalLoadedProducts: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // page가 0일 때는 0 * 2이므로 스킵이 없음, 페이지가 1이면 2개 스킵 2면 4개 스킵
    // page를 25씩 잡는다면 page * 25
    // skip : page * 3, => 버튼 바가 있을 땐 이렇게 하기
    skip: totalLoadedProducts,
    take: 3, // 3개 가져오기
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
