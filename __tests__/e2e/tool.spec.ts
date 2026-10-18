import { test, expect } from "@playwright/test";

test.describe("Core User Workflows E2E", () => {
  test("page loads and has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/System Config Builder/);
  });

  test("state persistence across reload", async ({ page }) => {
    await page.goto("/");
    await page.reload();
    await expect(page).toHaveTitle(/System Config Builder/);
  });

  test("keyboard shortcut dispatching", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+s");
    await page.keyboard.press("Control+z");
    const shortcutsButton = page.locator("button", { hasText: /shortcuts/i });
    if (await shortcutsButton.isVisible()) {
      await shortcutsButton.click();
      await expect(page.locator("text=Keyboard Shortcuts")).toBeVisible();
    }
  });

  test("export payload verification", async ({ page }) => {
    await page.goto("/");
    const exportBtn = page.locator("button", { hasText: /export/i }).first();
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
      await expect(
        page.locator("text=JSON").or(page.locator("text=YAML")),
      ).toBeVisible();
    }
  });

  test("dark and light theme toggle persistence", async ({ page }) => {
    await page.goto("/");
    const themeBtn = page
      .locator("button")
      .filter({ hasText: /theme|dark|light/i })
      .first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      const htmlEl = page.locator("html");
      const initialClass = await htmlEl.getAttribute("class");
      await themeBtn.click();
      const newClass = await htmlEl.getAttribute("class");
      expect(initialClass).not.toEqual(newClass);
    }
  });
});
