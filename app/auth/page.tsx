"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthTabs } from "./_components/AuthTabs";

export default function LoginPage() {
  const router = useRouter();

  // TODO: maybe use a proxy instead ??
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, []);

  return (
    <div className="py-8 lg:flex lg:flex-col lg:items-center">
      <div className="w-4/10">
        <AuthTabs />
      </div>
    </div>
  )
}
