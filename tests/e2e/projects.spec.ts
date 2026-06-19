import { expect, test } from "@playwright/test";

test("projects page lists projects and opens a detail", async ({ page }) => {
  await page.goto("/fr/projets");
  await expect(
    page.getByRole("heading", { level: 1, name: "Projets" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Portfolio" }).first().click();
  await expect(page).toHaveURL(/\/fr\/projets\/portfolio$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Portfolio" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Retour aux projets" }).click();
  await expect(page).toHaveURL(/\/fr\/projets$/);
});

test("unknown project slug renders the not-found page", async ({ page }) => {
  await page.goto("/fr/projets/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "404 — Page introuvable" }),
  ).toBeVisible();
});
