import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/fr", "/fr/projets", "/fr/graph", "/fr/mentions-legales"];

/**
 * Automated WCAG scan. It catches roughly a third of real accessibility issues
 * — enough to stop the mechanical regressions (missing accessible names,
 * contrast, ARIA misuse) that are easy to re-introduce — but it is a floor, not
 * proof of conformance. Keyboard and screen-reader checks stay manual.
 *
 * Both colour schemes are scanned: the palette defines a separate set of tokens
 * under `prefers-color-scheme: dark`, so a light-only scan would cover half of
 * it. `defaultTheme="system"` means the media query alone drives the theme.
 */
for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const path of paths) {
      test(`axe finds no violation — ${path}`, async ({ page }) => {
        await page.goto(path);
        // The graph mounts client-side; scan the settled tree, not the placeholder.
        await page.waitForLoadState("networkidle");
        // Sections fade in as they scroll into view: walk the page so every
        // reveal has played, otherwise axe measures text still at opacity 0.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 400) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        });
        await page.waitForTimeout(1500);

        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();

        expect(
          violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            nodes: violation.nodes.map((node) => node.target.join(" ")),
          })),
        ).toEqual([]);
      });
    }
  });
}
