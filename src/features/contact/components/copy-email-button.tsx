"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn-ui/button";

/** Copies the address, confirming in place (and to screen readers). */
export function CopyEmailButton({ email }: { email: string }) {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <Button
      type="button"
      variant="outline"
      size="xl"
      onClick={async () => {
        // Clipboard access can be refused (permissions, insecure context).
        try {
          await navigator.clipboard.writeText(email);
          setStatus("copied");
        } catch {
          setStatus("failed");
        }
      }}
    >
      {status === "copied" ? (
        <CheckIcon className="text-primary" />
      ) : (
        <CopyIcon />
      )}
      <span aria-live="polite">
        {status === "copied"
          ? t("copied")
          : status === "failed"
            ? t("copyFailed")
            : t("copy")}
      </span>
    </Button>
  );
}
