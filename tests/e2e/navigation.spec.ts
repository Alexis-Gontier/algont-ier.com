import { expect, test } from "@playwright/test";

// The nav links, theme toggle and locale switcher live in a `hidden md:flex`
// container; below `md` they move into the drawer. These cover the desktop
// chrome — the mobile drawer deserves its own spec rather than a widened
// selector that would pass for the wrong reason.
test.skip(
  ({ isMobile }) => !!isMobile,
  "Desktop header chrome; mobile uses the drawer",
);

test("header nav moves between pages", async ({ page }) => {
  await page.goto("/fr");
  const nav = page.getByRole("navigation").first();

  await nav.getByRole("link", { name: "Projets" }).click();
  await expect(page).toHaveURL(/\/fr\/projets$/);

  await page
    .getByRole("navigation")
    .first()
    .getByRole("link", { name: "Graph" })
    .click();
  await expect(page).toHaveURL(/\/fr\/graph$/);
});

// The starting state is `defaultTheme="system"`, so the first assertion below
// depends on the browser's colour scheme. Pin it instead of relying on
// Chromium's default.
test.use({ colorScheme: "light" });

test("theme toggle switches to dark mode", async ({ page }) => {
  await page.goto("/fr");
  const html = page.locator("html");

  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Changer de thème" }).click();
  await expect(html).toHaveClass(/dark/);
});

test("locale switcher changes the language", async ({ page }) => {
  await page.goto("/fr");

  await page.getByRole("button", { name: "Changer de langue" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
