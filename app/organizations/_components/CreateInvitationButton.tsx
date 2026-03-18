"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const invitationSchema = z.object({
  email: z.email().trim(),
  role: z.enum(["member", "admin"]),
});
type InvitationForm = z.infer<typeof invitationSchema>;

export function CreateInvitationButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<InvitationForm>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
      role: "member",
    }
  });
  const { isSubmitting } = form.formState;

  function handleCreateInvitation(data: InvitationForm) {
    return authClient.organization.inviteMember(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to invite user")
      },
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={o => {
        if (o) form.reset();
        setIsDialogOpen(o);
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="cursor-pointer"
        >
          Invite User
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite a user to collaborate with your team
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleCreateInvitation)}
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john.doe@domain.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">member</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>

              )}
            />

            <DialogFooter className="block">
              <Button
                type="submit"
                className="w-full cursor-pointer mb-2"
                disabled={isSubmitting}
              >
                <LoadingSwap isLoading={isSubmitting}>
                  Invite
                </LoadingSwap>
              </Button>
              <Button
                type="button"
                className="w-full cursor-pointer"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
