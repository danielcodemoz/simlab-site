import { test, expect } from "@playwright/test";

// Deterministic visibility lifecycle: real media playback, synthetic tab visibility events.
async function visibility(page, hidden) {
  await page.evaluate((hidden) => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: hidden,
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: hidden ? "hidden" : "visible",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}
for (const lang of ["pt", "en"]) {
  test(`gallery holds its image while keyboard focus is on controls (${lang})`, async ({
    page,
  }) => {
    await page.addInitScript(
      (lang) => localStorage.setItem("simlab-language", lang),
      lang,
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.locator(".preview-main").scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const selected = () =>
      page
        .locator('[data-preview][aria-pressed="true"]')
        .getAttribute("data-preview");
    const initial = await selected();
    await expect.poll(selected).not.toBe(initial);
    await page.locator("[data-preview]").first().focus();
    await page.keyboard.press("Tab");
    await expect(page.locator("[data-preview]").nth(1)).toBeFocused();
    const held = await selected();
    await page.waitForTimeout(1200);
    expect(await selected()).toBe(held);
    await page.locator("#gallery-motion").focus();
    await page.waitForTimeout(1200);
    expect(await selected()).toBe(held);
    await page.locator("#language").focus();
    await page.locator(".preview-main").scrollIntoViewIfNeeded();
    await expect.poll(selected).not.toBe(held);
  });
}

test("Studio resumes after visible-tab return but preserves manual pause and offscreen state", async ({
  page,
}) => {
  await page.goto("/");
  const video = page.locator(".studio video");
  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v) => !v.paused && v.currentTime > 0.1))
    .toBe(true);
  await visibility(page, true);
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  await visibility(page, false);
  await expect
    .poll(() => video.evaluate((v) => !v.paused), { timeout: 1500 })
    .toBe(true);
  await video.evaluate((v) => v.pause());
  await page.waitForTimeout(50); // allow the native pause event to reach the handler
  await visibility(page, true);
  await visibility(page, false);
  expect(await video.evaluate((v) => v.paused)).toBe(true);
  await video.evaluate((v) => v.play());
  await page.locator("h1").scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  await visibility(page, true);
  await visibility(page, false);
  expect(await video.evaluate((v) => v.paused)).toBe(true);
});

test("reduced motion keeps gallery and Studio manual across tab visibility changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".preview-main").scrollIntoViewIfNeeded();
  const before = await page.locator(".preview-main img").getAttribute("src");
  await visibility(page, true);
  await visibility(page, false);
  await page.waitForTimeout(1200);
  await expect(page.locator(".preview-main img")).toHaveAttribute(
    "src",
    before,
  );
  const video = page.locator(".studio video");
  await video.scrollIntoViewIfNeeded();
  await visibility(page, true);
  await visibility(page, false);
  expect(await video.evaluate((v) => v.paused && !v.hasAttribute("src"))).toBe(
    true,
  );
});
