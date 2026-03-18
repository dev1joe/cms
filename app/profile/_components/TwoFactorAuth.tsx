"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import QRCode from "react-qr-code";

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
}

const twoFactorSchema = z.object({
  password: z.string().min(1),
});

type twoFactorForm = z.infer<typeof twoFactorSchema>;

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
  const router = useRouter();
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);

  const form = useForm<twoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      password: "",
    }
  });

  const { isSubmitting } = form.formState;

  async function disable2FA(data: twoFactorForm) {
    await authClient.twoFactor.disable({ password: data.password }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to disable 2FA");
      },
      onSuccess: () => {
        form.reset();
        router.refresh();
      }
    });
  }

  async function enable2FA(data: twoFactorForm) {
    const res = await authClient.twoFactor.enable({ password: data.password });

    if (res.error) {
      toast.error(res.error.message || "Failed to enable 2FA")
    } else {
      setTwoFactorData(res.data);
      form.reset();
    }
  }

  if (twoFactorData !== null) {
    return (
      <QRCodeVerification {...twoFactorData} onDone={() => setTwoFactorData(null)} />
    );
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(isEnabled ? disable2FA : enable2FA)}>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full cursor-pointer"
          variant={isEnabled ? `destructive` : `default`}
        >
          <LoadingSwap isLoading={isSubmitting}>
            {isEnabled ? `Disable 2FA` : `Enable 2FA`}
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}

const qrSchema = z.object({
  code: z.string().length(6),
});

type qrForm = z.infer<typeof qrSchema>;

function QRCodeVerification({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);

  const form = useForm<qrForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      code: "",
    }
  });
  const { isSubmitting } = form.formState

  async function verifyQRCode(data: qrForm) {
    await authClient.twoFactor.verifyTotp({ code: data.code }, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to verify code");
      },
      onSuccess: () => {
        setVerificationSuccessful(true);
        form.reset();
      }
    });
  }

  if (verificationSuccessful) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-3">
          {`Save these "Backup" codes in a safe place. Yous can use them to access your account.`}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {backupCodes.map((code, idx) => (
            <div
              key={idx}
              className="p-2"
            >
              {code}
            </div>
          ))}
        </div>

        <Button
          onClick={onDone}
          className="w-full cursor-pointer"
        >
          Done
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        scan this QR code with your authenticator app and enter the code below
      </p>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(verifyQRCode)}>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full cursor-pointer">
            <LoadingSwap isLoading={isSubmitting}>
              Submit Code
            </LoadingSwap>
          </Button>
        </form>
      </Form>

      <div className="p-4 w-fit bg-white">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  );
}
