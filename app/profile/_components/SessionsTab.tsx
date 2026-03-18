"use client";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { Session } from "better-auth";
import { useEffect, useState } from "react";
import { SessionManagement } from "./SessionManagement";

export function SessionsTab({
  currentSessionToken
}: {
  currentSessionToken: string
}) {
  // TODO: how does useEffect & useState work, and why next/navigation router.refresh() can't rerun useEffect ?
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    authClient.listSessions().then((sessions) => {
      if (!sessions.error) {
        setSessions(sessions.data)
      }
    });
  }, []);

  return (
    <Card>
      <CardContent>
        <SessionManagement sessions={sessions} currentSessionToken={currentSessionToken} />
      </CardContent>
    </Card>
  );
}
