import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });
  await expect(page.locator("form")).toBeVisible();
});

test("empty contact form is rejected before a network submission", async ({
  page,
}) => {
  let submissions = 0;
  await page.route("**/api/leads", async (route) => {
    submissions += 1;
    await route.abort();
  });

  const form = page.locator("form");
  await form.locator('button[type="submit"]').click();

  await expect
    .poll(() =>
      form.evaluate(
        (element) =>
          !(element as HTMLFormElement).checkValidity() ||
          Boolean(
            element.querySelector('[aria-invalid="true"], [role="alert"]'),
          ),
      ),
    )
    .toBe(true);
  expect(submissions).toBe(0);
});

test("malformed email is rejected before a network submission", async ({
  page,
}) => {
  let submissions = 0;
  await page.route("**/api/leads", async (route) => {
    submissions += 1;
    await route.abort();
  });

  const form = page.locator("form");
  const email = form.locator('input[name="email"]');

  await form.locator('input[name="name"]').fill("Test User");
  await email.fill("invalid-email");
  await form.locator('textarea[name="message"]').fill(
    "This message exercises client-side validation without contacting the API.",
  );
  await form.locator('button[type="submit"]').click();

  await expect
    .poll(() =>
      email.evaluate(
        (element) =>
          element.matches(":invalid") ||
          element.getAttribute("aria-invalid") === "true",
      ),
    )
    .toBe(true);
  expect(submissions).toBe(0);
});
