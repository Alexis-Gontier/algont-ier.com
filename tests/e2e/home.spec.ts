import { expect, test } from "@playwright/test";

test("/ redirects to the default locale (fr)", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByText("Voir les projets")).toBeVisible();
});

test("english locale renders translated content", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("View projects")).toBeVisible();
});
