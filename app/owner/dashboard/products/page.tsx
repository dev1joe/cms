"use client";
import { ProductsTab } from "./_components/ProductsTab";
import { useDashboardContext } from "../context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProductForm } from "./_components/CreateProductForm";
import { useState } from "react";

export default function ProductsPage() {
  const { userId } = useDashboardContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
      <ProductsTab userId={userId} />
    </div>
  );
}
