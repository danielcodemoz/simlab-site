import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("/workspace/artifacts", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
for (const [name, width, height, lang] of [
  ["desktop", 1440, 1000, "pt"],
  ["mobile", 390, 844, "pt"],
  ["english", 1440, 1000, "en"],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:4173");
  if (lang === "en") await page.locator("#language").click();
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((i) => i.decode());
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: `/workspace/artifacts/simlab-${name}.png`,
    fullPage: true,
  });
  await page.screenshot({
    path: `/workspace/artifacts/simlab-${name}-hero.png`,
  });
  await page.close();
}
await browser.close();
