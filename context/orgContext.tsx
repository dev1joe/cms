"use client"
import { authClient } from "@/lib/auth/auth-client";
import { createContext, useContext } from "react";

type orgData = NonNullable<ReturnType<typeof authClient.useActiveOrganization>["data"]>;
type SessionContext = {
  session: orgData | null,
  isPending: boolean,
  error: unknown
}

const SessionContext = createContext<SessionContext | null>(null)


export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = authClient.useActiveOrganization();

  return (
    <SessionContext.Provider value={{ session, isPending, error }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
