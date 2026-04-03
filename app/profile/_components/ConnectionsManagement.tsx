"use client";;
import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import { SUPPORTED_OAUTH_PROVIDERS, SUPPORTED_OAUTH_PROVIDERS_DETAILS, supportedOAuthProvider } from "@/lib/OAuthProviders";
import { Plus, Unlink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export function ConnectionsManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    authClient.listAccounts().then((accounts) => {
      if (!accounts.error) {
        setAccounts(accounts.data);
      }
    });
  }, []);

  const nonCredentialAccounts = accounts.filter(a => a.providerId !== 'credential');
  const unlinkedAccounts = SUPPORTED_OAUTH_PROVIDERS.filter((provider) =>
    !nonCredentialAccounts.find(account =>
      account.providerId.toLowerCase() === provider.toLowerCase()
    )
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-xl">Linked accounts</h1>

        {nonCredentialAccounts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-secondary-muted">
              No linked accounts found
            </CardContent>
          </Card>
        ) : (
          <div>
            {nonCredentialAccounts.map((account, i) => (
              <LinkedAccountCard key={i} account={account} />
            ))}
          </div>
        )}
      </div>

      {unlinkedAccounts.length > 0 && (
        <div className="space-y-4">
          <h1 className="text-xl">Link other accounts</h1>

          {unlinkedAccounts.map((provider, i) => (
            <UnlinkedAccountCard key={i} providerName={provider} />
          ))}
        </div>
      )}
    </div >
  );
}

function LinkedAccountCard({ account }: { account: Account }) {
  const router = useRouter();

  const { name: providerName, Icon } = SUPPORTED_OAUTH_PROVIDERS_DETAILS[account.providerId as supportedOAuthProvider] || "";

  function unlinkAccount() {
    return authClient.unlinkAccount({
      providerId: account.providerId,
      accountId: account.accountId,
    }, {
      onSuccess: () => {
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardContent className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-3">
          <Icon className="size-[25] lg:size-[45]" />
          <div>
            <h3 className="text-xl font-semibold">{providerName}</h3>
            <p className="text-sm text-muted-foreground">Linked on {account.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
        <BetterAuthActionButton
          action={() => unlinkAccount()}
          variant='destructive'
          className="cursor-pointer"
        >
          <Unlink />
          unlink
        </BetterAuthActionButton>
      </CardContent>
    </Card>
  );
}

function UnlinkedAccountCard({ providerName }: { providerName: string }) {
  const providerDetails = SUPPORTED_OAUTH_PROVIDERS_DETAILS[providerName as supportedOAuthProvider];

  function linkAccount() {
    return authClient.linkSocial({
      provider: providerName,
      callbackURL: '/profile'
    })
  }

  return (
    <Card>
      <CardContent className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-3">
          <providerDetails.Icon className="size-[25] lg:size-[45]" />
          <div>
            <h3 className="text-xl font-semibold">{providerDetails.name}</h3>
            <p className="text-sm text-muted-foreground">
              connect your {providerDetails.name} account for easier sign-in
            </p>
          </div>
        </div>
        <BetterAuthActionButton
          action={() => linkAccount()}
          variant='secondary'
          className="cursor-pointer"
        >
          <Plus />
          connect
        </BetterAuthActionButton>
      </CardContent>
    </Card>
  );
}
