"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Pause control for the scrolling company names (WCAG 2.2.2: motion that runs
 * longer than 5 seconds next to other content must be stoppable — hover alone
 * doesn't help keyboard or touch users). Under reduced motion the marquee is
 * already still, so the control hides itself.
 */
export function MarqueePause({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Trust");
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? t("resume") : t("pause")}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:text-primary motion-reduce:hidden"
      >
        {paused ? (
          <PlayIcon className="size-4" />
        ) : (
          <PauseIcon className="size-4" />
        )}
      </button>
      <div
        className={cn(
          "min-w-0 flex-1",
          paused && "[&_*]:[animation-play-state:paused]!",
        )}
      >
        {children}
      </div>
    </div>
  );
}
