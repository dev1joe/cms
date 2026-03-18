"use client";
import { Session } from "better-auth";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { UAParser } from "ua-parser-js";
import { Monitor, ShieldQuestion, Smartphone, Trash2 } from "lucide-react";

// TODO: make session revocation immediate  
export function SessionManagement({
  sessions,
  currentSessionToken
}: {
  sessions: Session[],
  currentSessionToken: string
}) {
  const router = useRouter();

  const currentSession = sessions.find(s => s.token === currentSessionToken);
  const otherSessions = sessions.filter(s => s.token !== currentSessionToken);

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(
      undefined,
      { onSuccess: () => router.refresh() }
    );
  }

  return (
    <div className="space-y-6">
      {currentSession && <SessionCard session={currentSession} isCurrentSession />}

      {otherSessions.length === 0 ?
        <Card>
          <CardContent className="text-center py-8">
            <p>No other active sessions</p>
          </CardContent>
        </Card>
        : <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl">Other Sessions</h1>

            <BetterAuthActionButton
              action={revokeOtherSessions}
              variant="destructive"
              size="sm"
              className="cursor-pointer"
              successMessage="Other Sessions revoked"
            >
              Revoke other sessions
            </BetterAuthActionButton>
          </div>
          {otherSessions.map((s, i) => (<SessionCard key={i} session={s} />))}
        </div>
      }
    </div>

  );
}

function SessionCard({
  session,
  isCurrentSession = false
}: {
  session: Session,
  isCurrentSession?: boolean
}) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInfo() {
    if (userAgentInfo == null) return "Unknown Device";

    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device";
    }

    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;

    return `${userAgentInfo.os.name}, ${userAgentInfo.browser.name}`
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date))
  }

  function getIcon(size = "size-[30] lg:size-[50]") {
    if (userAgentInfo?.os.name?.toLowerCase() == "linux") {
      return <Monitor className={size} />
    }

    if (!userAgentInfo?.device.type) {
      return (<ShieldQuestion className={size} />);
    }

    const deviceType = userAgentInfo.device.type;

    switch (deviceType) {
      case "desktop":
        return <Monitor className={size} />;
      case "mobile":
        return <Smartphone className={size} />;
      case "embedded":
        return <ShieldQuestion className={size} />;
      default:
        return <ShieldQuestion className={size} />;
    }
  }

  function revokeSession() {
    return authClient.revokeSession(
      { token: session.token },
      {
        onSuccess: () => {
          // console.log("session revoked, refreshing page using next/navigation router");
          router.refresh();
        }
      }
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{getBrowserInfo()}</CardTitle>
        {isCurrentSession && <Badge>Current Session</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="flex justify-between items-center gap-3 text">
            {getIcon()}
            <div className="[&>p]:text-xs [&>p]:text-muted-foreground">
              <p>Created: {formatDate(session?.createdAt) || 'N/A'}</p>
              <p>Expires: {formatDate(session?.expiresAt) || 'N/A'}</p>
            </div>
          </div>

          {!isCurrentSession && <BetterAuthActionButton
            action={revokeSession}
            variant="destructive"
            className="cursor-pointer"
            successMessage="Session revoked"
          >
            <Trash2 />
          </BetterAuthActionButton>}
        </div>
      </CardContent>
    </Card>
  );
}
