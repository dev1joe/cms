"use client";
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { LoadingSwap } from '../../../components/ui/loading-swap';
import { PasswordInput } from '../../../components/ui/password-input';
import { PasskeysButton } from '@/app/auth/_components/PasskeysButton';

export function SignInTab({
  openVerificationTab,
  openForgotPasswordTab,
}: {
  openVerificationTab: (email: string) => void
  openForgotPasswordTab: () => void
}) {
  const router = useRouter();

  const signinSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(1),
  });

  type signinForm = z.infer<typeof signinSchema>;

  const form = useForm<signinForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { isSubmitting } = form.formState;

  async function handleSignin(data: signinForm) {
    await authClient.signIn.email({ ...data }, {
      onError: (error) => {
        console.log(error);
        if (error.error.code == "EMAIL_NOT_VERIFIED") {
          openVerificationTab(data.email)
        }
        toast.error(error.error.message || "Failed to sign in");
      },
      onSuccess: () => {
        router.push("/");
      }
    })
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    autoComplete='email webauthn'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className='flex justify-between'>
                  <FormLabel>Password</FormLabel>
                  <Button
                    type='button'
                    variant='link'
                    onClick={openForgotPasswordTab}
                    className='cursor-pointer'
                  >
                    Forgot Password?
                  </Button>
                </div>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete='current-password webauthn'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TODO: confirm password field */}

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

      <PasskeysButton />
    </div>
  );
}
