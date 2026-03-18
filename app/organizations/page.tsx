import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { CreateOrganizationButton } from "./_components/CreateOrganizationButton";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrganizationSelect } from "./_components/OrganizationSelect";
import { OrganizationTabs } from "./_components/OrganizationTabs";

export default async function OrganizationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session === null) {
    return redirect("/auth");
  }

  return (
    <div className="container mx-auto my-6 px-4">
      <Link href="/" className="cursor-pointer inline-flex items-center mb-6">
        <ArrowLeft className="mr-2 size-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <OrganizationSelect />
        <CreateOrganizationButton />
      </div>

      <OrganizationTabs />
    </div>
  );
}
