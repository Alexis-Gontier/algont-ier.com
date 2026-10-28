import { cn } from "@/lib/utils/cn";

/**
 * Hover micro-interaction for link and button labels: the text rolls up and a
 * copy rolls in from below. Driven by the nearest `group` ancestor (the link or
 * button), so the whole target triggers it, keyboard focus included.
 *
 * The copy is `aria-hidden`; screen readers read the label once. Under reduced
 * motion nothing travels — the parent's colour change is the only feedback.
 */
export function RollText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const roll =
    "block transition-transform duration-500 ease-(--ease-out-expo) motion-reduce:transition-none";

  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <span
        className={cn(
          roll,
          "group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:translate-y-0!",
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          roll,
          "absolute inset-0 translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:hidden",
        )}
      >
        {children}
      </span>
    </span>
  );
}
