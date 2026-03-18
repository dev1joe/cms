"use client";
import { authClient } from "@/lib/auth/auth-client";
import { BetterAuthActionButton } from "./BetterAuthActionButton";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";

export function ImpersonationIndicator() {
  const { data: session, refetch } = authClient.useSession();
  const router = useRouter();

  function handleStopImpersonation() {
    return authClient.admin.stopImpersonating(
      undefined, {
      onSuccess: () => {
        refetch();
        router.push('/admin');
      }
    })
  }

  // using loose inequality operator for treating "undefined" & "null" the same
  if (session?.session.impersonatedBy != null) {
    return (
      <div className="fixed left-4 bottom-4 z-999">
        <BetterAuthActionButton
          action={handleStopImpersonation}
          variant="destructive"
          size="sm"
          className="cursor-pointer"
        >
          <UserX size={4} /> Stop Impersonation
        </BetterAuthActionButton>
      </div>
    );
  }
}
