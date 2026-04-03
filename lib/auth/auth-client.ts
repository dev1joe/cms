import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/plugins"
import { passkeyClient } from "@better-auth/passkey/client"
import { adminClient, inferAdditionalFields, organizationClient } from "better-auth/client/plugins";
import { auth } from "./auth";

const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = '/auth/2fa'
      }
    }),
    passkeyClient(),
    adminClient(),
    organizationClient(),
  ]
});

console.log("auth client is created");

export { authClient };
