"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function TotpForm() {
  const router = useRouter();

  const totpSchema = z.object({
    code: z.string().length(6),
  });

  type totpForm = z.infer<typeof totpSchema>;

  const form = useForm<totpForm>({
    resolver: zodResolver(totpSchema),
    defaultValues: {
      code: ""
    }
  });

  const { isSubmitting } = form.formState;

  async function verifyTotp(data: totpForm) {
    await authClient.twoFactor.verifyTotp({ code: data.code }, {
      onError: (error) => {
        toast.error(
          error.error.message || "Failed to verify code",
          { description: "Redirecting to sign-in page..." }
        );
        setTimeout(() => {
          redirect("/auth");
        }, 2000);
      },
      onSuccess: () => {
        toast.loading("Redirecting to home page...", { duration: 1, closeButton: true });
        router.push("/");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(verifyTotp)}>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full cursor-pointer">
          <LoadingSwap isLoading={isSubmitting}>
            Submit Code
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
