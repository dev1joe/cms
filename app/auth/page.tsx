"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthTabs } from "./_components/AuthTabs";

export default function LoginPage() {
  const router = useRouter();

  // TODO: maybe use a proxy instead ??
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  return (
    <div className="py-8 lg:flex lg:flex-col lg:items-center">
      <AuthTabs />
    </div>
  )
}
