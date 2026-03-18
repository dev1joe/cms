"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";
import { MembersTab } from "./MembersTab";
import { InvitationsTab } from "./InvitationsTab";

export function OrganizationTabs() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  console.log(`from org tabs component, active org: ${activeOrganization?.name}`);

  return (
    <div className="space-y-4">
      {activeOrganization && (
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="cursor-pointer" value="members">Members</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="invitations">Invitations</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          <Card>
            <CardContent>
              <TabsContent value="members">
                <MembersTab />
              </TabsContent>

              <TabsContent value="invitations">
                <InvitationsTab />
              </TabsContent>

              <TabsContent value="subscriptions">
                {/* TODO: implement this tab */}
                {/* <SubscriptionsTab /> */}
                subscriptions tab
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  )
}
