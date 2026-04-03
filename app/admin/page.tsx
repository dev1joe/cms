import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { Users } from "lucide-react";
import { headers } from "next/headers";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRow } from "./_components/UserRow";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) return redirect("/auth");

  const hasPermission = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permission: { user: ['list'] } },
  });
  if (!hasPermission.success) return redirect('/');

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' }
  });

  return (
    <>
      <Navbar />

      <div className="mx-auto container my-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users ({users.total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.users.map((user) => (
                  <UserRow key={user.id} user={user} selfId={session.user.id} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
