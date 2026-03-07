import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductCardDropDown } from "./ProductCardDropDown";
import { Product } from "@/db/schema";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <ProductCardDropDown productId={product.id} isHidden={product.hidden || false} />
        </CardAction>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>

        {product.hidden && (
          <Badge variant="secondary" >
            Hidden
          </Badge>
        )}
      </CardHeader>
      {/* <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter> */}
    </Card>
  )
}
