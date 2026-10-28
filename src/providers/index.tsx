import { NextIntlClientProvider } from "next-intl";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/providers/theme-provider";

/**
 * Composes every app-wide provider in one place. Add future providers here
 * (analytics, query client, …) rather than nesting them in the root layout.
 *
 * `NextIntlClientProvider` auto-inherits locale & messages from the request
 * when rendered from a Server Component, so nothing needs to be passed here.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
