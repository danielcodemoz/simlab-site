import { test, expect } from "@playwright/test";
for (const lang of ["pt", "en"])
  for (const width of [390, 1440]) {
    test(`installer safety ${lang} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (lang) => localStorage.setItem("simlab-language", lang),
        lang,
      );
      await page.goto("/");
      const section = page.locator("#windows-safety");
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
      await section.locator("summary").click();
      await expect(section).toContainText(
        "Get-FileHash -LiteralPath '.\\SimLab-1.0.2-setup.exe' -Algorithm SHA256",
      );
      await expect(section).toContainText(
        "77dd19fe36c392bdf7cb8c1de8a4268d8a888db04edfe79ec9ca86e9403a46cc",
      );
      await expect(section).toContainText(
        lang === "pt" ? "não segurança" : "not safety",
      );
      await expect(section.locator("video")).toHaveAttribute("controls", "");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `/tmp/sim-safety-${lang}-${width}.png`,
        fullPage: false,
      });
    });
  }
test("safety illustration stays English and respects reduced motion across site languages", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#windows-safety").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  expect(await page.locator("#safety-video").evaluate((v) => v.paused)).toBe(
    true,
  );
  const before = await page.locator("#safety-video source").getAttribute("src");
  await page.locator("#language").click();
  await expect(page.locator("#windows-safety")).toContainText("Download for Windows");
  expect(
    await page.locator("#safety-video source").getAttribute("src"),
  ).toBe(before);
  expect(before).toContain("install-guide-en-light-v5.mp4");
  await page.locator("#windows-safety").scrollIntoViewIfNeeded();
  expect(await page.locator("#safety-video").evaluate((v) => v.paused)).toBe(
    true,
  );
});
