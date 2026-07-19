import { expect, test } from "@playwright/test";

test.skip(
  process.env.PLAYWRIGHT_API_TESTS !== "1",
  "Direct mutation tests run only against the isolated production test server.",
);

const origin = "http://localhost:3000";

function validLead(overrides: Record<string, unknown> = {}) {
  return {
    name: "Test Visitor",
    email: "visitor@example.com",
    company: "Example Studio",
    projectType: "editorial-site",
    budget: "Discovery first",
    message: "This is a synthetic integration-test message with safe content.",
    consent: true,
    locale: "en",
    website: "",
    startedAt: Date.now() - 4_000,
    submissionId: crypto.randomUUID(),
    ...overrides,
  };
}

test.describe("POST /api/leads", () => {
  test("rejects unsupported content types", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { "content-type": "text/plain", origin },
      data: "not json",
    });

    expect(response.status()).toBe(415);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      code: "unsupported_media_type",
    });
  });

  test("rejects a foreign browser origin", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { origin: "https://attacker.example" },
      data: validLead(),
    });

    expect(response.status()).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      code: "invalid_origin",
    });
  });

  test("enforces the streamed payload limit", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { "content-type": "application/json", origin },
      data: JSON.stringify({ message: "x".repeat(17_000) }),
    });

    expect(response.status()).toBe(413);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      code: "payload_too_large",
    });
  });

  test("absorbs honeypot submissions without delivery", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { origin },
      data: { website: "https://spam.example", locale: "en" },
    });

    expect(response.status()).toBe(202);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  test("rejects submissions that arrive too quickly", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { origin },
      data: validLead({ startedAt: Date.now() }),
    });

    expect(response.status()).toBe(429);
    expect(response.headers()["retry-after"]).toBeTruthy();
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      code: "submission_too_fast",
    });
  });

  test("rejects expired forms", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { origin },
      data: validLead({ startedAt: Date.now() - 25 * 60 * 60 * 1_000 }),
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      code: "expired_form",
    });
  });

  test("fails safely when the email provider is not configured", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { origin },
      data: validLead(),
    });

    expect(response.status()).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      code: "service_unavailable",
    });
  });
});
