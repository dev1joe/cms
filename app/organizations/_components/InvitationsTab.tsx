"use clint";
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { CreateInvitationButton } from "./CreateInvitationButton";
import { Card } from "@/components/ui/card";

export function InvitationsTab() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const pendingInvitations = activeOrg?.invitations?.filter(
    invite => invite.status === "pending"
  ) || [];

  function handleCancelInvite(invitationId: string) {
    return authClient.organization.cancelInvitation({
      invitationId
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateInvitationButton />
      </div>

      {pendingInvitations.length === 0 ? (
        <Card className="px-6 py-20 text-center">
          There are no pending invitations.
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingInvitations.map(i => (
              <TableRow key={i.id}>
                <TableCell>{i.email}</TableCell>
                <TableCell>
                  <Badge>{i.role}</Badge>
                </TableCell>
                <TableCell>
                  {i.expiresAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <BetterAuthActionButton
                    action={() => handleCancelInvite(i.id)}
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Cancel
                  </BetterAuthActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
