"use client";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { productSelect } from "@/schemes/products.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function ProductsTab({ refreshSignal }: { refreshSignal: number }) {
  const [products, setProducts] = useState<Array<productSelect> | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>();

  // TODO: use SWR from vercel
  useEffect(() => {
    fetch("/api/products")
      .then(response => response.json())
      .then(data => setProducts(data.result || null))
      .catch(e => { console.log(e); toast.error("error loading products"); setError(e) })
      .finally(() => setIsLoading(false))
  }, [refreshSignal]);

  if (isLoading) {
    return (
      <Skeleton className="aspect-video w-full" />
    );
  }
  if (!products || products.length < 1) {
    return (
      <div className="bg-white/0.7 flex justify-center items-center">
        <p>You don't have any products yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map((prod, idx) => (
        <ProductCard key={idx} product={prod} />
      ))}
    </div>
  );
}
