import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const productionRun = process.env.PLAYWRIGHT_PRODUCTION === "1";
const focusedViewportTests =
  /(?:navigation-locale|reduced-motion|responsive)\.spec\.ts/;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], browserName: "chromium" },
    },
    {
      name: "chromium-mobile",
      testMatch: focusedViewportTests,
      use: { ...devices["Pixel 7"], browserName: "chromium" },
    },
    {
      name: "chromium-tablet",
      testMatch: focusedViewportTests,
      use: { ...devices["iPad Pro 11"], browserName: "chromium" },
    },
    {
      name: "webkit-mobile",
      testMatch: focusedViewportTests,
      use: { ...devices["iPhone 13"], browserName: "webkit" },
    },
  ],
  webServer: {
    command: productionRun
      ? "npm run build && exec ./node_modules/.bin/next start"
      : "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI && !productionRun,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      NEXT_PUBLIC_SITE_URL: new URL(baseURL).origin,
      RESEND_API_KEY: "",
      CONTACT_TO_EMAIL: "",
      CONTACT_FROM_EMAIL: "",
    },
  },
});
