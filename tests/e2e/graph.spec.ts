import { expect, test } from "@playwright/test";

test("graph page renders the interactive skills graph", async ({ page }) => {
  await page.goto("/fr/graph");
  await expect(
    page.getByRole("heading", { level: 1, name: "Graphe de compétences" }),
  ).toBeVisible();

  // React Flow mounts client-side and renders DOM nodes.
  await expect(page.locator(".react-flow__node").first()).toBeVisible();
  await expect(page.getByText("Portfolio").first()).toBeVisible();
});
