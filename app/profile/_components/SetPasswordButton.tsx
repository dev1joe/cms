"use client";

import { authClient } from "@/lib/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";

export function SetPasswordButton({ email: userEmail }: { email: string }) {
  return (
    <BetterAuthActionButton
      className="cursor-pointer"
      variant="outline"
      successMessage="Password reset email sent"
      action={() => {
        return authClient.requestPasswordReset({
          email: userEmail,
          redirectTo: "/auth/reset-password"
        })
      }
      }>
      Set Password
    </BetterAuthActionButton>
  );
}
