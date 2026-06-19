import { expect, test } from "@playwright/test";

test("/ redirects to the default locale (fr)", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("english locale renders translated content", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("home renders the hero and featured projects", async ({ page }) => {
  await page.goto("/fr");
  await expect(
    page.getByRole("heading", { level: 1, name: "Alexis Gontier" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Projets en vedette" }),
  ).toBeVisible();
});
