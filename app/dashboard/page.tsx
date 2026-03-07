"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProductForm } from "./_components/CreateProductForm";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductsTab } from "./_components/ProductsTab";

export default function DashboardLayout() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: session, isPending: isLoading } = authClient.useSession();
  const [refreshSignal, setRefreshSignal] = useState(0);
  const router = useRouter();

  // TODO: use skeleton when the dashboadr is complete
  if (isLoading) {
    return (<div>loading...</div>);
  }

  if (!session) {
    return router.push("/auth");
  }

  return (
    <div className="mx-auto container my-6 px-4 box-border max-h-screen">

      <div className="mb-3 flex gap-3">
        <Input placeholder="Search..." />
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
          <DialogTrigger asChild>
            <Button className="outline-none cursor-pointer">
              <Plus />Create
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new product</DialogTitle>
            </DialogHeader>

            <CreateProductForm
              closeDialog={() => setIsDialogOpen(false)}
              userId={session.user.id}
              onSuccess={() => setRefreshSignal(prev => prev + 1)}
            />

          </DialogContent>
        </Dialog>
      </div>

      <ProductsTab refreshSignal={refreshSignal} />
    </div>
  );
}
