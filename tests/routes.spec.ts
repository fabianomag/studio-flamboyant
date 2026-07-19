import { expect, test } from "@playwright/test";

import { PUBLIC_ROUTES, RETIRED_ROUTES } from "./site-contract";

test.describe("public route contract", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.path} renders in ${route.locale}`, async ({ page }) => {
      const runtimeErrors: string[] = [];
      page.on("pageerror", (error) => runtimeErrors.push(error.message));

      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });

      expect(response, `No document response for ${route.path}`).not.toBeNull();
      expect(response?.status(), `Unexpected status for ${route.path}`).toBe(200);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        new RegExp(`^${route.locale}`, "i"),
      );
      await expect(page).toHaveTitle(/\S/);
      expect(runtimeErrors, `Runtime errors on ${route.path}`).toEqual([]);
    });
  }
});

test.describe("retired routes", () => {
  for (const path of RETIRED_ROUTES) {
    test(`${path} is not publicly available`, async ({ page }) => {
      const response = await page.goto(path, {
        waitUntil: "domcontentloaded",
      });

      expect(response, `No document response for ${path}`).not.toBeNull();
      expect(response?.status(), `${path} must remain retired`).toBe(404);
    });
  }
});
