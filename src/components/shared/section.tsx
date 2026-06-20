import { cn } from "@/lib/utils/cn";

type SectionProps = React.ComponentProps<"section"> & {
  /** Inner container size — defaults to the readable content width. */
  container?: boolean;
  /** Vertical padding inside the container. Disable to let children own the full height. */
  padded?: boolean;
};

/**
 * Base wrapper for home page sections: a full-width band with a centered,
 * max-width inner container. Dividers between sections are owned by the page
 * (wrap the list in `divide-y divide-border`), not by the section itself.
 */
export function Section({
  className,
  container = true,
  padded = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={className} {...props}>
      <div
        className={cn(
          "mx-auto w-full px-4 sm:px-8",
          padded && "py-20",
          container && "max-w-6xl",
        )}
      >
        {children}
      </div>
    </section>
  );
}
