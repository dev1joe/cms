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

export function BackupCodeForm() {
  const router = useRouter();

  const backupCode = z.object({
    code: z.string().min(1),
  });

  type backupCodeForm = z.infer<typeof backupCode>;

  const form = useForm<backupCodeForm>({
    resolver: zodResolver(backupCode),
    defaultValues: {
      code: ""
    }
  });

  const { isSubmitting } = form.formState;

  async function verifyBackupCode(data: backupCodeForm) {
    await authClient.twoFactor.verifyBackupCode({ code: data.code }, {
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
        router.push("/");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(verifyBackupCode)}>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backup Code</FormLabel>
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
