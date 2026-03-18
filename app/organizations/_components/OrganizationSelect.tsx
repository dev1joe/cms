"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export function OrganizationSelect() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  console.log(`from org select component, active org: ${activeOrg?.name}`);

  if (organizations == null || organizations.length === 0) {
    return null;
  }

  function setActiveOrganization(organizationId: string) {
    return authClient.organization.setActive(
      { organizationId }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to switch organizations.");
      }
    }
    );
  }

  return (
    <Select
      value={activeOrg?.id || ""}
      onValueChange={setActiveOrganization}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
