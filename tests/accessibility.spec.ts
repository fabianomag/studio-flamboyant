import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { ACCESSIBILITY_ROUTES } from "./site-contract";

for (const path of ACCESSIBILITY_ROUTES) {
  test(`${path} has no serious or critical axe violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blockingViolations = results.violations
      .filter(({ impact }) => impact === "serious" || impact === "critical")
      .map(({ help, id, impact, nodes }) => ({
        id,
        impact,
        help,
        targets: nodes.map((node) => node.target.join(" ")),
      }));

    expect(
      blockingViolations,
      `Blocking axe violations on ${path}:\n${JSON.stringify(blockingViolations, null, 2)}`,
    ).toEqual([]);
  });
}
