"use client";
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { authClient } from "@/lib/auth/auth-client";

export function AccountDeletion() {
  return (
    <BetterAuthActionButton
      action={() => authClient.deleteUser({ callbackURL: '/' })}
      successMessage="Account deletion initiated, please check your email to confirm."
      variant="destructive"
      className="cursor-pointer w-full"
      requireAreYouSure
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  );
}
