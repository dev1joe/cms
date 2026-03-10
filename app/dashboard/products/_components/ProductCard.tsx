import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ExternalLinkIcon, EyeIcon, EyeOffIcon, PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useProduct } from "@/hooks/useProduct";
import { DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

export function ProductCard({ product }: { product: Product }) {
  const { mutate } = useProduct();

  function handleToggleVisibility() {
    fetch(
      `/api/products/${product.id}/toggle-visibility`,
      { method: "POST" }
    ).then(response => {
      if (!response.ok) {
        toast.error("error toggling visibility");
      } else {
        toast.success("visbility toggled");
        mutate();
      }
    })
  }

  function handleDeleteProduct() {
    fetch(
      `/api/products/${product.id}`,
      { method: "DELETE" }
    ).then(response => {
      if (!response.ok) {
        toast.error("error deleting product");
      } else {
        toast.success("Product deleted successfully");
        mutate();
      }
    })
  }

  return (
    <AlertDialog>
      <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden">
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
                  size="icon"
                >
                  <EllipsisVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <ExternalLinkIcon />
                    Open
                  </DropdownMenuItem>
                  {product.hidden
                    ? <DropdownMenuItem className="cursor-pointer" onClick={handleToggleVisibility}><EyeIcon />Show</DropdownMenuItem>
                    : <DropdownMenuItem className="cursor-pointer" onClick={handleToggleVisibility}><EyeOffIcon />Hide</DropdownMenuItem>
                  }
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <DialogTrigger className="w-full">
                      <PencilIcon />
                      Edit
                    </DialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" variant="destructive" asChild>
                  <AlertDialogTrigger className="w-full">
                    <TrashIcon />
                    Delete
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>

          {product.hidden && (
            <Badge variant="secondary" >
              Hidden
            </Badge>
          )}
        </CardHeader>
        {/*
          <CardFooter>
            <Button className="w-full">View Event</Button>
          </CardFooter>
        */}
      </Card>


      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProduct}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
