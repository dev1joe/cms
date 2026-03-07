import { Button } from "@/components/ui/button";
import { EllipsisVertical, ExternalLinkIcon, EyeIcon, EyeOffIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner";

type DropDownProps = {
  productId: number,
  isHidden: boolean,
}

// TODO: handle hide VS show buttons
// TODO: activate the buttons, what is the most optimal way ??
export function ProductCardDropDown({
  productId,
  isHidden
}: DropDownProps
) {
  function handleToggleVisibility() {
    fetch(
      `/api/products/${productId}/toggle-visibility`,
      { method: "POST" }
    ).then(response => {
      if (!response.ok) {
        toast.error("error toggling visibility");
        // TODO: how to refresh the products list ??
      } else {
        toast.success("visbility toggled");
      }
    })
  }

  return (
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
          {isHidden
            ? <DropdownMenuItem className="cursor-pointer" onClick={handleToggleVisibility}><EyeIcon />Show</DropdownMenuItem>
            : <DropdownMenuItem className="cursor-pointer" onClick={handleToggleVisibility}><EyeOffIcon />Hide</DropdownMenuItem>
          }
          <DropdownMenuItem className="cursor-pointer">
            <PencilIcon />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" variant="destructive">
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
