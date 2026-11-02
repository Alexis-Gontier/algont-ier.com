import { expect, test } from "@playwright/test";

const paths = [
  "/fr",
  "/fr/projets",
  "/fr/projets/portfolio",
  "/fr/graph",
  "/fr/mentions-legales",
  "/en",
];

/**
 * Regression guard: a grid/flex child defaults to `min-width: auto`, so any
 * wide descendant (a marquee, an absolutely-positioned measurement row) silently
 * stretches the whole document past the viewport. It reads as a broken site on
 * a phone and it is invisible at desktop widths — hence the `mobile` project.
 */
for (const path of paths) {
  test(`no horizontal overflow — ${path}`, async ({ page }) => {
    await page.goto(path);
    const { scroll, client } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));

    expect(
      scroll,
      `${path} overflows by ${scroll - client}px`,
      // Sub-pixel layout rounding can add 1px without being a real overflow.
    ).toBeLessThanOrEqual(client + 1);
  });
}

test("the home page logs no console error", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/fr");
  await page.waitForLoadState("networkidle");

  expect(errors).toEqual([]);
});
