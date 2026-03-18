import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Key } from 'lucide-react';

export function PasskeysButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  useEffect(() => {
    authClient.signIn.passkey({ autoFill: true }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to sign in");
      },
      onSuccess: () => {
        refetch();
        router.push('/');
      }
    });
  })

  return (
    <BetterAuthActionButton
      className="w-full cursor-pointer"
      variant="outline"
      action={() => {
        return authClient.signIn.passkey(undefined, {
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign in");
          },
          onSuccess: () => {
            refetch();
            router.push('/');
          }
        });
      }}
    >
      <Key />
      Use Passkey
    </BetterAuthActionButton>
  );

}
