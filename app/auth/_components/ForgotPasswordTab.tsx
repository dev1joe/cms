"use client";
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { LoadingSwap } from '../../../components/ui/loading-swap';

export function ForgotPasswordTab({
  openSignInTab
}: { openSignInTab: () => void }) {
  const forgotPasswordSchema = z.object({
    email: z.email().min(1),
  });

  type forgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

  const form = useForm<forgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  const { isSubmitting } = form.formState

  async function handleSubmit(data: forgotPasswordForm) {
    await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: '/auth/reset-password'
    }, {
      onError: (error) => {
        toast.error(
          error.error.message || "Failed to send password reset email"
        );
      },
      onSuccess: () => {
        toast.success('Password reset email sent');
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-4'>
          <Button
            size="lg"
            variant="outline"
            onClick={openSignInTab}
            className='cursor-pointer flex-1'
          >
            Go Back
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='cursor-pointer flex-6'
            size="lg"
          >
            <LoadingSwap isLoading={isSubmitting}>
              Submit
            </LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
