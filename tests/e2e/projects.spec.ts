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

  // While a view transition plays, its pseudo-element overlay takes the
  // pointer: let the page's arrival animation finish before clicking.
  await page.waitForFunction(
    () => !document.documentElement.matches(":active-view-transition"),
  );
  await page.getByRole("link", { name: "Tous les projets" }).click();
  await expect(page).toHaveURL(/\/fr\/projets$/);
});

// Asserting the status code, not just the heading: a `notFound()` that renders
// the right page while answering HTTP 200 is a soft 404 — search engines index
// it as a real page. The heading alone can't tell the two apart.
for (const path of [
  "/fr/projets/does-not-exist",
  "/fr/nimportequoi",
  "/en/foo",
]) {
  test(`unknown URL answers 404 — ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /404/ }).first(),
    ).toBeVisible();
  });
}
