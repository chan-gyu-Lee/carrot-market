import { formatToTimeAgo, formatToWon } from "@/lib/util";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ListProduct({
  created_at,
  id,
  photo,
  price,
  title,
}: Readonly<ListProductProps>) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-xl overflow-hidden">
        {/* 이미지의 크기를 설정해야 함. next.js에서는 img 태그가 아닌 Image 태그를 사용해야 함.  */}
        <Image fill src={photo} alt={title} />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}
