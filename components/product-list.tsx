"use client";
import { InitialProductsType } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/action";

interface ProductListProps {
  initialProduct: InitialProductsType;
}

export default function ProductList({
  initialProduct,
}: Readonly<ProductListProps>) {
  const [product, setProduct] = useState(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // ref를 걸어서 해당 span이 화면 안에 없으면 null 화면 안에 들어오면 span 객체를 가진다.
  const trigger = useRef<HTMLSpanElement>(null);
  console.log(trigger);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        console.log(entries);
        const element = entries[0];
        // intersecting될 곳에 왔고, triger가 있다면
        if (element.isIntersecting && trigger.current) {
          // 옵저빙 하는 것을 멈춤, 멈추지 않으면 계속해서 데이터를 불러올 수 있음.
          observer.unobserve(trigger.current);
          // 로딩 시작
          setIsLoading(true);
          // 현재 로딩 된 제품의 수만큼 스킵해야하기 때문에 length를 보냄
          const newProducts = await getMoreProducts(product.length);
          // length가 0인건 더 이상 가져올 데이터가 없다는 것.
          if (newProducts.length !== 0) {
            setProduct((prev) => [...prev, ...newProducts]);
            // 페이지를 직접 사용하진 않지만 트리거 용으로 사용
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      // 해당 옵저버가 100% 다 보여야지 true로 변경됨
      { threshold: 1.0 }
    );
    // 여기서 옵저버와 ref를 연결함.
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    // 페이지에서 나가면 옵저버 연결 끊는 클린함수
    return () => {
      observer.disconnect();
    };
    //page를 사용해서 재실행 시키기.
  }, [page]);
  return (
    <div className="p-5 flex flex-col gap-5">
      {product.map((product, idx: number) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? (
        <div>마지막 페이지 입니다.</div>
      ) : (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 900}vh`, // 버튼을 멀리보내지 않으면 한번에 로딩 다됨
          }}
          className=" mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95 disabled:bg-neutral-400"
        >
          {isLoading ? "Loading..." : "more+"}
        </span>
      )}
    </div>
  );
}
