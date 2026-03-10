"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/db/schema";
import { productInsert, productInsertSchema, productUpdate } from "@/schemes/products.schema";
import { toast } from "sonner";
import useSWR from 'swr';
import { ApiResponseBody } from '@/lib/http/types';
import { useProduct } from '@/hooks/useProduct';

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
}

export function CreateProductForm({
  userId,
  product,
  closeDialog,
}: formProps
) {
  const { mutate } = useProduct();  // console.log("userId", userId);

  const form = useForm<productInsert>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      userId: userId,
      name: product?.name || "",
      description: product?.description || "",
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
      // onSuccess();
      mutate();
    }
  }

  // TODO: implement function
  async function handleProductUpdate(data: productUpdate) {
    console.log("submitted data", data);

    const response = await fetch(`/api/products/${product?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Failed to update product");
      console.log("response", response)
      // TODO: check for validation errors, if any, use the "setErrors" function from react-hook-form
    } else {
      toast.success("Product updated successfully");
      closeDialog();
      form.reset();
      mutate();
    }
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
                <Input type="text" {...field} hidden />
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
                <Input type="text" {...field} />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-2'>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 cursor-pointer"
            onClick={closeDialog}
          >
            Close
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 cursor-pointer"
            size={'lg'}
          >
            <LoadingSwap isLoading={isSubmitting}>
              {product
                ? "Update Product"
                : "Create Product"
              }
            </LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  )
}
