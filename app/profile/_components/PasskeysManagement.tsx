"use client";
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { Passkey } from "@better-auth/passkey";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const passkeySchema = z.object({
  name: z.string().min(1),
});

type passkeyForm = z.infer<typeof passkeySchema>;

export function PasskeysManagement({ passkeys }: { passkeys: Passkey[] }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log(`# of passkeys ${passkeys.length}.`);
  console.log(passkeys);

  const form = useForm<passkeyForm>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: ""
    },
  });
  const { isSubmitting } = form.formState;


  function handleDeletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey({ id: passkeyId }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to delete passkey.");
      },
      onSuccess: () => {
        router.refresh();
      }
    });
  }

  function handleAddPasskey(data: passkeyForm) {
    return authClient.passkey.addPasskey({ name: data.name }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to add passkey.");
      },
      onSuccess: () => {
        setIsDialogOpen(false);
        router.refresh();
      }
    });
  }

  if (passkeys.length === 0) {
    return (
      <div className="space-y-6">
        {passkeys.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No passkeys yet</CardTitle>
              <CardDescription>
                Add your first passkey for secure, passwordless authentication.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {passkeys.map(passkey => {
              console.log(passkey);
              return (
                <Card key={passkey.id}>
                  <CardHeader className="flex gap-2 items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle>{passkey.name}</CardTitle>
                      <CardDescription>
                        Created {new Date(passkey.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <BetterAuthActionButton
                      requireAreYouSure
                      variant="destructive"
                      size="icon"
                      action={() => handleDeletePasskey(passkey.id)}
                    >
                      <Trash2 />
                    </BetterAuthActionButton>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        )}

        <Dialog
          open={isDialogOpen}
          onOpenChange={o => {
            if (o) form.reset();
            setIsDialogOpen(o);
          }}
        >
          <DialogTrigger
            className="w-full"
            asChild
          >
            <Button
              type="button"
              className="w-full cursor-pointer"
            >
              New Passkey
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new passkey</DialogTitle>
              <DialogDescription>
                Add your first passkey for secure, passwordless authentication.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddPasskey)}
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

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  <LoadingSwap isLoading={isSubmitting}>
                    Add
                  </LoadingSwap>
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </div>
    );
  }
}
