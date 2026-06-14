import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/shadcn-ui/sonner";
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
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </NuqsAdapter>
    </NextIntlClientProvider>
  );
}
