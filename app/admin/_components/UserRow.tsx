"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { UserWithRole } from "better-auth/plugins";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserRow({ user, selfId }: {
  user: UserWithRole,
  selfId: string
}) {
  const { refetch } = authClient.useSession();
  const router = useRouter();
  const isSelf = user.id === selfId;

  function handleImpersonateUser(userId: string) {
    authClient.admin.impersonateUser({ userId }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to impersonate user.");
      },
      onSuccess: () => {
        refetch();
        router.push('/');
      }
    });
  }

  function handleRevokeSessions(userId: string) {
    authClient.admin.revokeUserSessions({ userId }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to revoke user sessions.");
      },
      onSuccess: () => {
        toast.success("User sessions revoked");
      }
    });
  }

  function handleUnbanUser(userId: string) {
    authClient.admin.unbanUser({ userId: userId }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to unban user.");
      },
      onSuccess: () => {
        toast.success("User unbanned successfully");
        router.refresh();
      }
    })
  }

  function handleBanUser(userId: string) {
    authClient.admin.banUser({ userId }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to ban user.");
      },
      onSuccess: () => {
        toast.success("User banned successfully");
        router.refresh();
      }
    })
  }

  function handleRemoveUser(userId: string) {
    authClient.admin.removeUser({ userId }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to delete user.");
      },
      onSuccess: () => {
        toast.success("User deleted successfully.");
        router.refresh();
      }
    })
  }

  return (
    <TableRow key={user.id}>
      <TableCell>
        <div>
          <div className="font-medium">{user.name || "No name"}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="flex items-center gap-2 not-empty:mt-2">
            {user.banned && <Badge variant="destructive">Banned</Badge>}
            {!user.emailVerified && <Badge variant="outline">Unverified</Badge>}
            {isSelf && <Badge>You</Badge>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleImpersonateUser(user.id)}
                >
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleRevokeSessions(user.id)}
                >
                  Revoke Sessions
                </DropdownMenuItem>
                {user.banned ? (
                  <DropdownMenuItem
                    onClick={() => handleUnbanUser(user.id)}
                    className="cursor-pointer"
                  >
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleBanUser(user.id)}
                    className="cursor-pointer"
                  >
                    Ban User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRemoveUser(user.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  )
}
