"use client";
import { authClient } from "@/lib/auth/auth-client";
import { BetterAuthActionButton } from "../../../components/auth/BetterAuthActionButton";
import { useRef, useState } from "react";

type VerificationTabProps = {
  email: string,
}

export function NotVerifiedTab({ email }: VerificationTabProps) {
  // using state for rerendering the UI
  const [countdown, setCountDown] = useState<number>(0);
  // using ref for changing interval id without re-rendering the UI + immutable
  const interval = useRef<NodeJS.Timeout>(undefined);

  // TODO: there is an error when calling this function in the component scope, solve that
  function startEmailVerificationCountdown(time = 30) {
    setCountDown(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setCountDown((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }

        return newT;
      });
    }, 1000);
  };

  return (
    <div>
      <div className="mb-2 ">
        <h2 className="text-lg md:text-xl mb-2">
          Your email is <span className="text-yellow-500 font-semibold">NOT</span> verified
        </h2>
        <p className="text-xs md:text-sm mb-2">
          Click to verify your account, we will email you a verification link.
        </p>
      </div>

      <BetterAuthActionButton
        className="cursor-pointer w-full"
        size='lg'
        disabled={countdown > 0}
        successMessage="Verification email sent"
        action={() => {
          startEmailVerificationCountdown()
          return authClient.sendVerificationEmail({
            email: email,
            callbackURL: "/profile?tab=security"
          });
        }}>{(countdown > 0)
          ? `Verify Email (${countdown})`
          : `Verify Email`
        }
      </BetterAuthActionButton>
    </div>
  );
}
