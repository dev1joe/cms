"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconCreditCard, IconDashboard, IconInnerShadowTop, IconLogout, IconNotification, IconUserCircle, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <div className="w-full min-h-12 p-5 flex justify-between align center z-990 border-2 border-gray-500">
      {/*  gourping logo and links */}
      <div className="flex gap-6">
        <Link href="/">
          <IconInnerShadowTop className="size-5! inline me-1" />
          <span className="text-base font-semibold">Acme Inc.</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/">link</Link>
          <Link href="/">link</Link>
          <Link href="/">link</Link>
          <Link href="/">link</Link>
        </div>
      </div>
      <UserAvatar />
    </div>
  );
}

function UserAvatar() {
  const { data: session, isPending: loading } = authClient.useSession()
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authClient.admin.hasPermission({ permission: { user: ['list'] } }).then((data) => {
      if (data.data?.success) {
        setIsAdmin(true);
      }
    });
  }, []);

  if (loading) {
    return (
      <Skeleton className="h-8 w-8 rounded-lg" />
    );
  }

  if (session === null) {
    return (
      <Link href="/auth">
        <Button size="lg" className="cursor-pointer">
          Sign In / Sign Up
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="h-8 w-8 rounded-lg grayscale">
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{"Jhon Doe"}</span>
              <span className="truncate text-xs text-muted-foreground">
                {"test@test.com"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Profile Button */}
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/profile">
              <IconUserCircle />
              Profile
            </Link>
          </DropdownMenuItem>

          {/* Dashboard Button */}
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/dashboard">
              <IconDashboard />
              Dashboard
            </Link>
          </DropdownMenuItem>

          {/* Organizations Button */}
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/organizations">
              <IconUsers />
              Organizations
            </Link>
          </DropdownMenuItem>

          {/* Admin Button */}
          {isAdmin &&
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/admin">
                Admin
              </Link>
            </DropdownMenuItem>
          }

          <DropdownMenuItem className="cursor-pointer">
            <IconCreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <IconNotification />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => authClient.signOut()}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
