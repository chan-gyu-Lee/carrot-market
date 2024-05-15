import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

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
      <Link
        href={"/products/add"}
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
