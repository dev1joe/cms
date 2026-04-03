"use client"
import { ProfileUpdateForm } from "./ProfileUpdateForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseBusiness, BriefcaseBusinessIcon } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { toast } from "sonner";
import { useState } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useRouter } from "next/navigation";

type AccountTabProps = {
  id: string,
  name: string,
  email: string,
  type: string,
}

export function AccountTab({ id, name, email, type }: AccountTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleConvertToOwner(): Promise<{ error: boolean, message: string }> {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${id}/to-owner`, { method: "POST" });
      if (!response.ok) {
        const msg = "Error converting to business owner account";
        toast.error(msg);
        return { error: true, message: msg };
      }
      const msg = "Converted to business owner account successfully";
      toast.success(msg);
      router.refresh(); // re-runs the server component, hides the card
      return { error: false, message: msg };
    } catch {
      const msg = "Error converting to business owner account";
      toast.error(msg);
      return { error: true, message: msg };
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <ProfileUpdateForm email={email} name={name} />
        </CardContent>
      </Card>

      {type !== "owner" && (
        <Card>
          <CardHeader>
            <CardTitle>Business Account</CardTitle>
            <CardDescription>convert to a business account to open stores on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 justify-between">
              <div className="">
                <ul className="list-disc ms-4 mb-6">
                  <li>Add products</li>
                  <li>Schedule discounts</li>
                </ul>
                <ActionButton
                  action={handleConvertToOwner}
                  className="cursor-pointer"
                >
                  <LoadingSwap isLoading={isLoading}>
                    Become a business owner
                  </LoadingSwap>
                </ActionButton>
              </div>
              <BriefcaseBusinessIcon className="size-36 me-4" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
