"use client";
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function InvitationInformation({ invitation }: {
  invitation: { id: string, organizationId: string }
}) {
  const router = useRouter();

  function acceptInvitation() {
    return authClient.organization.acceptInvitation({
      invitationId: invitation.id
    }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to accept invitation.");
      },
      onSuccess: async () => {
        await authClient.organization.setActive({
          organizationId: invitation.organizationId
        });
        router.push("/organizations");
      }
    });
  }

  function rejectInvitation() {
    return authClient.organization.rejectInvitation({
      invitationId: invitation.id
    }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to reject invitation");
      },
      onSuccess: () => {
        router.push("/");
      }
    })
  }

  // TODO: show more information about the invitation and the organization here
  return (
    <div className="w-full flex gap-2">
      <BetterAuthActionButton
        className="cursor-pointer grow"
        action={acceptInvitation}
      >
        Accept
      </BetterAuthActionButton>

      <BetterAuthActionButton
        variant="destructive"
        className="cursor-pointer grow"
        action={rejectInvitation}
      >
        Reject
      </BetterAuthActionButton>
    </div>
  );
}
