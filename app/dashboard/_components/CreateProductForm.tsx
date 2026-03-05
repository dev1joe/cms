"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/db/schema";
import { productInsert, productInsertSchema } from "@/schemes/products.schema";
import { toast } from "sonner";

// const createProductSchema = z.object({
//   name: z.string().min(1),
//   description: z.string(),
//   userId: z.string(),
// });
// type createProductForm = z.infer<typeof createProductSchema>;

type formProps = {
  userId: string,
  product?: Product,
  closeDialog: () => void,
  onSuccess: () => void
}

export function CreateProductForm({
  userId,
  product,
  closeDialog,
  onSuccess,
}: formProps
) {
  // console.log("userId", userId);

  const form = useForm<productInsert>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      userId: userId,
      name: "",
      description: "",
    }
  });

  const { isSubmitting } = form.formState

  // TODO: implement function
  async function handleProductCreation(data: productInsert) {
    console.log("submitted data", data);
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Failed to create product");
      console.log("response", response)
      // TODO: check for validation errors, if any, use the "setErrors" function from react-hook-form
    } else {
      toast.success("Product Created successfully");
      closeDialog();
      form.reset();
      onSuccess();
    }
  }

  // TODO: implement function
  async function handleProductUpdate(data: productInsert) {
    console.log("submitted data", data);
    closeDialog();
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(product)
          ? form.handleSubmit(handleProductUpdate)
          : form.handleSubmit(handleProductCreation)
        }
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" {...field} value={userId} hidden />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={product?.name} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={product?.description} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer"
          size={'lg'}
        >
          <LoadingSwap isLoading={isSubmitting}>
            {product
              ? "Update Product"
              : "Create Product"
            }
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
