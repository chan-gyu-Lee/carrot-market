import ListProduct from "@/components/list-product";
import db from "@/lib/db";

async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
  });
  return products;
}

export default async function Products() {
  const products = await getProducts();
  console.log(products);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product, idx: number) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}