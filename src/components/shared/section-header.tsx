import { cn } from "@/lib/utils/cn";

type SectionHeaderProps = {
  /** Short mono path shown above the title, e.g. `~/projets`. */
  label?: string;
  title: string;
  subtitle?: string;
  /** `h1` on standalone pages, `h2` for home sections. */
  as?: "h1" | "h2";
  /** Trailing element (a "view all" link…), bottom-aligned on desktop. */
  action?: React.ReactNode;
  className?: string;
};

/**
 * Heading block shared by the home sections and the standalone pages: a violet
 * mono path, a large tight title and a muted lead. Its parts carry
 * `data-reveal-item`, so inside a `Reveal` they come in one after another.
 */
export function SectionHeader({
  label,
  title,
  subtitle,
  as: Heading = "h2",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        {label && (
          <p data-reveal-item className="font-mono text-primary text-sm">
            {label}
          </p>
        )}
        <Heading
          data-reveal-item
          className="text-balance font-bold text-4xl leading-[1.05] tracking-[-0.03em] sm:text-5xl"
        >
          {title}
        </Heading>
        {subtitle && (
          <p
            data-reveal-item
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div data-reveal-item className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
