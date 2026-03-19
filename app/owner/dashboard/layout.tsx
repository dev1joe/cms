"use client";
import { AppSidebar } from "./_components/app-sidebar"
import { SiteHeader } from "./_components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { DashboardContext } from "./context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div>loading...</div>
    );
  }

  if (!session) {
    return router.push("/auth");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <DashboardContext.Provider value={{ userId: session.user.id }}>
          {/* <!-- Layer 1: takes up all remaining space in the sidebar layout --> */}
          <div className="flex flex-1 flex-col">

            {/* <!-- Layer 2: registers the container query scope named "main" --> */}
            <div className="@container/main flex flex-1 flex-col gap-2">

              {/* <!-- Layer 3: the actual content flow with responsive spacing --> */}
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </DashboardContext.Provider>
      </SidebarInset>
    </SidebarProvider>
  )
}
