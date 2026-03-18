"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function ResetPasswordPage() {
  const router = useRouter();

  // getting token
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || "";
  const error = searchParams.get('error');

  // Form configurations
  const resetPasswordSchema = z.object({
    password: z.string().min(6)
  });

  type resetPasswordForm = z.infer<typeof resetPasswordSchema>;

  const form = useForm<resetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" }
  });

  const { isSubmitting } = form.formState;

  function handleSubmit(data: resetPasswordForm) {
    if (token == null) return;

    authClient.resetPassword({
      newPassword: data.password,
      token: token
    }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to reset password");
      },
      onSuccess: () => {
        toast.success(
          "Password reset successful", {
          description: "Redirecting to login..."
        });
        setTimeout(() => {
          router.push("/auth");
        }, 1000)
      }
    })
  }

  // handling invalid reset links
  if (token == null || error != null) {
    return (
      <div className="flex py-8 justify-center lg:flex lg:flex-col lg:items-center lg:justify-start">
        <Card className="lg:w-5/12">
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>The password reset link is invalid or has expired</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="cursor-pointer w-full"
              onClick={() => router.push("/auth")}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex py-8 justify-center lg:flex lg:flex-col lg:items-center lg:justify-start">
      <Card className="lg:w-5/12">
        <CardHeader className="text-2xl font-bold">
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form} >
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO: add password confirmation field */}

              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full cursor-pointer'
                size={"lg"}
              >
                <LoadingSwap isLoading={isSubmitting}>
                  Submit
                </LoadingSwap>
              </Button>
            </form>

          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
