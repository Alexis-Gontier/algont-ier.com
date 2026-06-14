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

test("language switcher navigates to the other locale", async ({ page }) => {
  await page.goto("/fr");
  await page.getByRole("button", { name: "Changer de langue" }).click();
  await page.getByRole("menuitemradio", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
