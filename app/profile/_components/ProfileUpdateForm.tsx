"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner"
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export function ProfileUpdateForm({ email: userEmail, name: username }: {
  email: string,
  name: string,
}) {
  const router = useRouter();

  const updateProfileSchema = z.object({
    email: z.email().min(1),
    name: z.string().min(1),
  });

  type updateProfileForm = z.infer<typeof updateProfileSchema>;

  const form = useForm<updateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: userEmail,
      name: username
    }
  });

  const { isLoading: isSubmitting } = form.formState;

  async function handleUpdate(data: updateProfileForm) {
    const promises = [
      authClient.updateUser({ name: data.name })
    ];

    if (data.email !== userEmail) {
      promises.push(authClient.changeEmail({ newEmail: data.email }));
    }

    const res = await Promise.all(promises);

    const updateResult = res[0];
    const emailResult = res[1];

    if (emailResult?.error) {
      toast.error(emailResult.error.message || "Failed to update Email");
    } else if (updateResult.error) {
      toast.error(updateResult.error.message || "Failed to update profile");
    } else {
      if (data.email !== userEmail) {
        toast.success(
          "Verify your new email address to complete the change",
          { description: "check the inbox of your new email for a verification email" }
        );
      } else {
        toast.success("Profile updated successfully");
      }

      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdate)}
        className="space-y-4"
      >
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
            Update Profile
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
