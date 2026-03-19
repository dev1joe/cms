import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ForgotPasswordTab } from "@/app/auth/_components/ForgotPasswordTab";
import { SignInTab } from "@/app/auth/_components/SignInTab";
import { SignUpTab } from "@/app/auth/_components/SignUpTab";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "@/app/auth/_components/SocialAuthButtons";

type Tab = "signin" | "signup" | "verification" | "forgot-password";

export function AuthTabs() {
  const [selectedTab, setSelectedTab] = useState("signin");

  return (
    <Tabs
      value={selectedTab}
      defaultValue="signin"
      onValueChange={t => setSelectedTab(t as Tab)}
      className="max-auto"
    >
      {(selectedTab == "signup" || selectedTab == "signin") &&
        <TabsList className="**:cursor-pointer">
          <TabsTrigger value="signin" onClick={() => setSelectedTab('signin')}>Sign In</TabsTrigger>
          <TabsTrigger value="signup" onClick={() => setSelectedTab('signup')}>Sign Up</TabsTrigger>

          {/* forgot password tab should be hidden */}
          {/* <TabsTrigger value="forgot-password" onClick={() => setSelectedTab('forgot-password')}>Forgot Password</TabsTrigger> */}
        </TabsList>
      }

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab
              openForgotPasswordTab={() => setSelectedTab('forgot-password')}
            />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="forgot-password">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPasswordTab openSignInTab={() => setSelectedTab('signin')} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

  );
}
