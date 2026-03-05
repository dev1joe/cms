"use client";
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session, isPending: loading } = authClient.useSession()

  useEffect(() => {
    authClient.admin.hasPermission({ permission: { user: ['list'] } }).then((data) => {
      if (data.data?.success) {
        setIsAdmin(true);
      }
    });

    if (session && !session.user.emailVerified) {
      toast.warning("your email is not verified");
    }
  }, []);

  if (loading) {
    return (<LoadingScreen />);
  }

  return (
    <main className="min-h-full p-12 lg:p-20 mt-3 flex flex-col items-center justify-start gap-3 outline-4 outline-babyblue-200">

      {session === null ? (
        <>
          <h1 className="text-4xl font-bold">Welcome to our App</h1>
          <Link href="/auth">
            <Button size="lg" className="cursor-pointer">
              Sign In / Sign Up
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">Welcome {session.user.name}</h1>

          {/*  TODO: maybe move all these buttons to a navabr */}
          <div className="flex gap-4 justify-center">
            {/* Profile Button */}
            <Link href="/profile">
              <Button size='lg' className="cursor-pointer">
                Profile
              </Button>
            </Link>

            {/* Dashboard Button */}
            <Link href="/dashboard">
              <Button size='lg' className="cursor-pointer">
                Dashboard
              </Button>
            </Link>

            <Link href="/organizations">
              <Button size='lg' className="cursor-pointer" variant="outline">
                Organizations
              </Button>
            </Link>

            {/* admin button */}
            {isAdmin &&
              <Link href="/admin">
                <Button size='lg' variant='outline' className="cursor-pointer">
                  Admin
                </Button>
              </Link>
            }

            {/* sign out button */}
            <BetterAuthActionButton
              className="cursor-pointer"
              variant="destructive"
              size="lg"
              action={() => authClient.signOut()}
            >
              Sign Out
            </BetterAuthActionButton>
          </div>
        </>
      )
      }
    </main>
  );
}
