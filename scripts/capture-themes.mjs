import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const dir = "/workspace/artifacts/themes";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
for (const theme of ["light", "dark"])
  for (const lang of ["pt", "en"])
    for (const [size, width, height] of [
      ["desktop", 1440, 1000],
      ["mobile", 390, 844],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height },
        reducedMotion: "reduce",
      });
      await page.addInitScript(
        ({ theme, lang }) => {
          localStorage.setItem("simlab-theme", theme);
          localStorage.setItem("simlab-language", lang);
        },
        { theme, lang },
      );
      await page.goto("http://127.0.0.1:4173");
      await page.evaluate(() => document.fonts.ready);
      for (const img of await page.locator("img").all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((i) => i.decode());
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `${dir}/${theme}-${lang}-${size}.png`,
        fullPage: true,
      });
      if (size === "desktop")
        await page
          .locator("#download")
          .screenshot({ path: `${dir}/${theme}-${lang}-downloads.png` });
      await page.close();
    }
await browser.close();
