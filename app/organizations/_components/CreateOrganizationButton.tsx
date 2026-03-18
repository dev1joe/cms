"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(1),
});

type createOrganizationForm = z.infer<typeof createOrganizationSchema>;

export function CreateOrganizationButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<createOrganizationForm>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    }
  });
  const { isSubmitting } = form.formState;

  async function handleOrgCreation(data: createOrganizationForm) {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const res = await authClient.organization.create({
      name: data.name,
      slug,
    });

    if (res.error) {
      toast.error(res.error.message || "Failed to create organization");
    } else {
      form.reset()
      setIsDialogOpen(false);
      await authClient.organization.setActive({ organizationId: res.data.id });
    }
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
          className="cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          Create Organization
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOrgCreation)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="block">
              <Button
                type="submit"
                className="w-full cursor-pointer block mb-2"
                disabled={isSubmitting}
              >
                <LoadingSwap isLoading={isSubmitting}>
                  Create
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
