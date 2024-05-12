import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // 처음 2개만 가져오기
    take: 2,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

// prisma의 return 타입을 가지고 자동으로 타입스크립트가 인지하게 만들기
export type InitialProductsType = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initailProducts: InitialProductsType = await getInitialProducts();

  return (
    <div>
      {/* use client를 최대한 피하기 위함. */}
      <ProductList initialProduct={initailProducts} />
    </div>
  );
}
