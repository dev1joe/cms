"use client";
import { useProduct } from "@/hooks/useProduct";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Product } from "@/db/schema";

export function ProductsSection() {
  const {
    data,
    isError,
    isLoading,
  } = useProduct();

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-40 h-10 mb-5" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {Array.from({ length: 6 }).map((_: unknown, idx: number) => (
            <Skeleton key={idx} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.log('error: ', isError);
    return (
      <div className="bg-white/0.7 flex justify-center items-center">
        error fetching products
      </div>
    );
  }

  if (!data?.success || !data.result) {
    console.log("data: ", data)
    return (
      <div className="bg-white/0.7 flex justify-center items-center">
        <p>You don't have any products yet</p>
      </div>
    );
  }

  const displayProducts = data.result.filter(prod => prod.hidden === false)

  return (
    <div>
      <h1 className="text-5xl bold mb-5">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        {displayProducts.map((prod, idx) => (
          <ProductCard key={idx} product={prod} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      {/*
          <CardFooter>
            <Button className="w-full">View Event</Button>
          </CardFooter>
        */}
    </Card>
  );
}
