import { cn } from "@/lib/utils/cn";

/**
 * The framed surface the skills graph sits on — dotted ground, violet halo
 * behind it — shared by the home page card and the /graph page.
 */
export function GraphCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className="relative" {...props}>
      {/* The identity's one glow, behind the card. */}
      <div
        aria-hidden
        className="-inset-y-10 -inset-x-3 md:-inset-10 pointer-events-none absolute rounded-full bg-primary/15 blur-3xl dark:bg-primary/20"
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card/60 transition-colors duration-500 hover:border-primary/40",
          "bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
