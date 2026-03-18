import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { InvitationInformation } from "./_components/InvitationInformation";

export default async function InvitationPage({
  params
}: PageProps<"/organizations/invitations/[id]">) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session === null) {
    return redirect("/auth");
  }

  const { id } = await params;
  const invitation = await auth.api.getInvitation({
    headers: await headers(),
    query: { id }
  }).catch(() => {
    redirect("/");
  });

  return (
    <div className="container mx-auto my-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join {invitation.organizationName} organization as a {invitation.role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvitationInformation invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  );
}
