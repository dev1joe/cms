"use client"

import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { authClient } from "@/lib/auth/auth-client"
import { Button } from "@/components/ui/button"

const { isMobile } = useSidebar()

type Store = {
  name: string
  logo: React.ElementType
  plan: string
}

export function StoreSwitcher({
  stores,
  otherStores
}: {
  stores: Store[]
  otherStores: Store[]
}) {
  const [activeTeam, setActiveTeam] = useState(stores[0])

  if (!activeTeam) {
    return null
  }

  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length < 1) {
    return (
      <Button>Create Store</Button>
    );
  } else {
    <storesDropdown />
  }
}

function storesDropdown({
  activeStore,
  setActiveStore,
  stores,
  otherStores,
}: {
  activeStore: Store,
  setActiveStore: (store: Store) => void,
  stores: Store[],
  otherStores: Store[],
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="
                bg-sidebar-accent
                text-sidebar-accent-foreground
                cursor-pointer
              "
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <activeStore.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeStore.name}</span>
            <span className="truncate text-xs">{activeStore.plan}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        side={isMobile ? "bottom" : "right"}
        sideOffset={4}
      >
        {/* =========== your stores =========== */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          your stores
        </DropdownMenuLabel>

        {stores.map((store, index) => (
          <DropdownMenuItem
            key={store.name}
            onClick={() => setActiveStore(store)}
            className="gap-2 p-2 cursor-pointer"
          >
            <div className="flex size-6 items-center justify-center rounded-md border">
              <store.logo className="size-3.5 shrink-0" />
            </div>
            {store.name}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* =========== others stores =========== */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          other stores (member of)
        </DropdownMenuLabel>

        {otherStores.map((store, index) => (
          <DropdownMenuItem
            key={store.name}
            onClick={() => setActiveStore(store)}
            className="gap-2 p-2 cursor-pointer"
          >
            <div className="flex size-6 items-center justify-center rounded-md border">
              <store.logo className="size-3.5 shrink-0" />
            </div>
            {store.name}
            <DropdownMenuShortcut>⌘{index + stores.length + 1}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* =========== create new store =========== */}
        <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Create store</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}
