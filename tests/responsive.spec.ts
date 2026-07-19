import { expect, test } from "@playwright/test";

import { RESPONSIVE_ROUTES } from "./site-contract";

for (const path of RESPONSIVE_ROUTES) {
  test(
    `${path} keeps its semantic shell inside the viewport`,
    async ({ page }) => {
      const runtimeErrors: string[] = [];
      page.on("pageerror", (error) => runtimeErrors.push(error.message));

      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main")).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 1 }).first(),
      ).toBeVisible();

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `Horizontal overflow on ${path}`).toBeLessThanOrEqual(1);
      expect(runtimeErrors, `Runtime errors on ${path}`).toEqual([]);
    },
  );
}
