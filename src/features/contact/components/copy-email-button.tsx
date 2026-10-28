"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn-ui/button";

/** Copies the address, confirming in place (and to screen readers). */
export function CopyEmailButton({ email }: { email: string }) {
  const t = useTranslations("Contact");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      type="button"
      variant="outline"
      size="xl"
      onClick={async () => {
        await navigator.clipboard.writeText(email);
        setCopied(true);
      }}
    >
      {copied ? <CheckIcon className="text-primary" /> : <CopyIcon />}
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </Button>
  );
}
