"use client"
import { authClient } from "@/lib/auth/auth-client";
import { createContext, useContext } from "react";

type sessionData = NonNullable<ReturnType<typeof authClient.useSession>["data"]>;
type SessionContext = {
  session: sessionData | null,
  isPending: boolean,
  error: unknown
}

const SessionContext = createContext<SessionContext | null>(null)


export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = authClient.useSession();

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
