import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Key, LinkIcon, Shield, Trash2, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileUpdateForm } from "@/app/profile/_components/ProfileUpdateForm";
import { SecurityTab } from "./_components/SecurityTab";
import { SessionsTab } from "./_components/SessionsTab";
import { AccountsManagement } from "./_components/AccountManagement";
import { AccountDeletion } from "./_components/AccountDeletion";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type searchParams = {
  [key: string]: string | string[] | undefined
}

function getTab(params: searchParams): string | null {
  let tab: string | null;
  if (!params.tab) {
    return null
  } else {
    const paramType = typeof (params.tab);
    if (Array.isArray(params.tab) && params.tab.length > 0 && paramType == "string") {
      return params.tab[0];
    } else if (!Array.isArray(params.tab) && paramType == "string") {
      return params.tab;
    }
    return null;
  }
}

export default async function ProfilePage({
  searchParams
}: {
  searchParams: Promise<searchParams>
}) {
  const params = await searchParams;
  const tab = getTab(params);
  console.log(`tab: ${tab}`);

  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) {
    return redirect("/auth");
  }

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 box-border">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session?.user.image ? (
              <Image
                width={64}
                height={64}
                src={session?.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-start">
              <h1 className="text-3xl font-bold">
                {session?.user.name || "User Profile"}
              </h1>
              <Badge>Badge</Badge> {/**{session.data?.user.role} */}
            </div>
            <p className="text-muted-foreground">{session?.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" value={tab || "profile"} >
        <TabsList className="w-full grid grid-cols-5 **:cursor-pointer">
          <TabsTrigger value="profile">
            <Link href="/profile" className="w-full flex justify-center gap-1" replace>
              <User />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Link href="?tab=security" className="w-full flex justify-center gap-1" replace>
              <Shield />
              <span className="hidden sm:inline">Security</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Link href="?tab=sessions" className="w-full flex justify-center gap-1" replace>
              <Key />
              <span className="hidden sm:inline">Sessions</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <Link href="?tab=accounts" className="w-full flex justify-center gap-1" replace>
              <LinkIcon />
              <span className="hidden sm:inline">Accounts</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Link href="?tab=danger" className="w-full flex justify-center gap-1" replace>
              <Trash2 />
              <span className="hidden sm:inline">Danger</span>
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              {session && <ProfileUpdateForm email={session.user.email} name={session.user.name} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          {session && <SecurityTab
            email={session.user.email}
            isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
            isEmailVerified={session.user.emailVerified}
          />}
        </TabsContent>

        <TabsContent value="sessions">
          {session && <SessionsTab currentSessionToken={session.session.token} />}
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardContent>
              <AccountsManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive text-2xl">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDeletion />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
