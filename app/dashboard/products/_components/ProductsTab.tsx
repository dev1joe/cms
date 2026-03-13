"use client";
import { useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import { ProductCard } from "./ProductCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProductForm } from "./CreateProductForm";

export function ProductsTab({
  userId,
}: {
  userId: string,
}) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const {
    data,
    isError,
    isLoading,
  } = useProduct();

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6">
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

  console.log("data: ", data)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
      {data.result.map((prod, idx) => (
        <Dialog key={idx} open={isUpdateDialogOpen} onOpenChange={isOpen => setIsUpdateDialogOpen(isOpen)}>
          <ProductCard product={prod} />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update product</DialogTitle>
            </DialogHeader>
            <CreateProductForm
              userId={userId}
              product={prod}
              closeDialog={() => setIsUpdateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
