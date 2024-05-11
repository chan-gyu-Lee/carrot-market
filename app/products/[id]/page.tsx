import DeleteButton from "@/components/delete-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/util";
import { UserIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "./action";

interface ProductDetailProps {
  params: { id: string };
}

// session에 저장된 아이디와 제품에 등록된 userId가 같다면 물건 주인
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function ProductDetail({
  params,
}: Readonly<ProductDetailProps>) {
  const id = Number(params.id);
  // id를 막치고 들어왔을 때 에러 처리
  if (isNaN(id)) {
    return notFound();
  }
  // 없는 제품번호일 경우
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  // 물건을 올린 주인인지 확인
  const isOwner = await getIsOwner(product.userId);

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={product.photo} alt={product.title} />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full">
          {product.user.avatar !== null ? (
            <Image
              className="rounded-full"
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <DeleteButton productId={id} deleteFunction={deleteProduct} />
        ) : (
          <Link
            className="bg-orange-500 p-5 py-2.5 rounded-md font-semibold text-white"
            href={``}
          >
            채팅하기
          </Link>
        )}
      </div>
    </div>
  );
}
