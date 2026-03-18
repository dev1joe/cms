"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { TotpForm } from "./_components/totpForm";
import { authClient } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";
import { BackupCodeForm } from "./_components/backupCodeForm";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function TwoFactorAuthPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return (<LoadingScreen />);

  // if (!isPending && session === null) {
  //     redirect("/auth");
  // }

  if (!isPending) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Two-Factor Authentication (2FA)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="totp">
              <TabsList className="w-full grid grid-cols-2 **:cursor-pointer mb-8">
                <TabsTrigger value="totp">Authenticator</TabsTrigger>
                <TabsTrigger value="code">Backup Code</TabsTrigger>
              </TabsList>
              <TabsContent value="totp">
                <TotpForm />
              </TabsContent>
              <TabsContent value="code">
                <BackupCodeForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }
}
