import { expect, test } from "@playwright/test";

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
