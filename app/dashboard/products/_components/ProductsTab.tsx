"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useProduct";
import { CreateProductForm } from "./CreateProductForm";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ProductsTab({ userId }: { userId: string }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const {
    data,
    isError,
    isLoading,
  } = useProduct();

  if (isLoading) {
    return (
      <Skeleton className="aspect-video w-full" />
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
    <div className="px-4 lg:px-6">
      <div className="mb-3 flex gap-3">
        <Input placeholder="Search..." />
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => setIsCreateDialogOpen(open)}>
          <DialogTrigger asChild>
            <Button className="outline-none cursor-pointer">
              <Plus />
              <span className="hidden lg:inline">Create</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new product</DialogTitle>
            </DialogHeader>

            <CreateProductForm
              closeDialog={() => setIsCreateDialogOpen(false)}
              userId={userId}
            />

          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
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
    </div>
  );
}
