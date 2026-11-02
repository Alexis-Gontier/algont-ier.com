import { expect, test } from "@playwright/test";

test("graph page renders the interactive skills graph", async ({ page }) => {
  await page.goto("/fr/graph");
  await expect(
    page.getByRole("heading", { level: 1, name: "Graphe de compétences" }),
  ).toBeVisible();

  // The graph is drawn on a canvas; its content is reachable through the
  // toolbar's search, which opens a node's detail panel.
  await expect(page.locator("canvas")).toBeVisible();
  await page.getByRole("searchbox").fill("portfolio");
  await page.getByRole("searchbox").press("Enter");
  await expect(
    page.getByRole("region", { name: "Portfolio" }).getByRole("link", {
      name: "Voir le projet",
    }),
  ).toBeVisible();
});

test("graph settings change the display", async ({ page }) => {
  await page.goto("/fr/graph");
  await page.getByRole("button", { name: "Réglages du graphe" }).click();
  const settings = page.getByRole("region", { name: "Réglages du graphe" });
  await expect(settings.getByRole("heading", { name: "Forces" })).toBeVisible();

  const oneOff = settings.getByRole("checkbox", {
    name: "Technologies propres à un seul projet",
  });
  await expect(oneOff).toBeChecked();
  await oneOff.uncheck();
  await expect(oneOff).not.toBeChecked();
});
