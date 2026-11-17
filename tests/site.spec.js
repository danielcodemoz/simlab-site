import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1440]) {
  test(`responsive navigation and accessibility at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("ciência");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((i) => i.complete && i.naturalWidth > 0))
        .toBe(true);
    }
    if (width < 761) {
      for (let i = 0; i < 2; i++) {
        await page.locator(".menu").click();
        await expect(page.locator("nav")).toBeVisible();
        await page.locator("nav a").first().click();
        await expect(page.locator("nav")).not.toBeVisible();
      }
    }
    for (const a of await page.locator('a[href^="#"]').all()) {
      const hash = await a.getAttribute("href");
      if (hash !== "#") expect(await page.locator(hash).count()).toBe(1);
    }
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
test("catalogue, languages, persistent preference and FAQ", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#result-count")).toHaveText(
    "89 experiências encontradas",
  );
  await page.locator("#show-all").click();
  await expect(page.locator(".result")).toHaveCount(89);
  await page.locator("#show-all").click();
  await expect(page.locator(".result")).toHaveCount(8);
  await page.locator('[data-subject="biology"]').click();
  await expect(page.locator('[data-filter="biology"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#search").fill("zzzz");
  await expect(page.locator(".empty")).toBeVisible();
  await page.locator('[data-filter="all"]').click();
  await page.locator("#search").fill("moleculas");
  await expect(page.locator(".result")).toHaveCount(1);
  await page.locator("#search").fill("");
  await page.locator("#language").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toContainText("Science");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  for (const summary of await page.locator("#perguntas summary").all()) {
    await summary.click();
    await expect(summary.locator("..")).toHaveAttribute("open", "");
    await summary.click();
  }
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await expect(page.locator(".download-action:disabled")).toHaveCount(1);
  await expect(page.locator(".download-action[href]")).toHaveCount(2);
  await expect(page.locator('[data-download="appimage"]')).toContainText(
    "In preparation",
  );
  for (const summary of await page
    .locator(".file-verification summary")
    .all()) {
    await summary.click();
    await expect(summary.locator("..").locator("code")).toBeVisible();
    await summary.click();
  }
  await page.locator("#language").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-MZ");
});
test("reduced motion and keyboard access", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  expect(
    await page
      .locator(".hero-lab")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("gallery changes actual images repeatedly", async ({ page }) => {
  await page.goto("/");
  for (let pass = 0; pass < 2; pass++)
    for (const button of await page.locator("[data-preview]").all()) {
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect
        .poll(() =>
          page
            .locator(".preview-main img")
            .evaluate((i) => i.complete && i.naturalWidth > 0),
        )
        .toBe(true);
      await expect(page.locator(".preview-main figcaption")).toContainText(
        await button.textContent(),
      );
    }
});
for (const theme of ["light", "dark"])
  for (const lang of ["pt", "en"]) {
    test(`theme ${theme} / ${lang}: contrast, images and mobile layout`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ theme, lang }) => {
          localStorage.setItem("simlab-theme", theme);
          localStorage.setItem("simlab-language", lang);
        },
        { theme, lang },
      );
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        lang === "pt" ? "pt-MZ" : "en",
      );
      await expect(page.locator(".lab-feature img")).toHaveAttribute(
        "src",
        new RegExp(`-${theme}\\.jpg$`),
      );
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.setViewportSize({ width: 390, height: 844 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator(".download-action:disabled")).toHaveCount(1);
      await page.locator("#theme").click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        theme === "light" ? "dark" : "light",
      );
      expect(
        await page.evaluate(() => localStorage.getItem("simlab-theme")),
      ).toBe(theme === "light" ? "dark" : "light");
    });
  }

test("Windows links use owner-confirmed URLs; Linux stays unavailable", async ({
  page,
}) => {
  await page.goto("/");
  for (const kind of ["setup", "portable"]) {
    const link = page.locator(`[data-download="${kind}"] .download-action`);
    const url = `https://simlab.danielpro.dev/downloads/SimLab-1.0.1-${kind}.exe`;
    await expect(link).toHaveAttribute("href", url);
    await expect(link).toHaveText("Transferir");
    // Verify browser navigation wiring without pretending this stub validates the server.
    await page.route(url, (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<p>Navigation test only</p>",
      }),
    );
    await link.click();
    await expect(page).toHaveURL(url);
    await page.goto("/");
  }
  await expect(
    page.locator('[data-download="appimage"] button'),
  ).toBeDisabled();
});
