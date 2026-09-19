/**
 * Base Page Object.
 *
 * Holds shared helpers (waiting, typing, tapping) so the concrete page
 * objects stay small and focused on their own selectors.
 */
export default class Page {
  /**
   * Build an Android UiSelector by resource-id.
   * @param {string} id resource id without the package prefix
   */
  byId(id) {
    return `android=new UiSelector().resourceId("com.sourcey.materialloginexample:id/${id}")`;
  }

  /**
   * Build an Android UiSelector by visible text.
   * @param {string} text
   */
  byText(text) {
    return `android=new UiSelector().text("${text}")`;
  }

  /**
   * Build an Android UiSelector by className.
   * @param {string} className
   */
  byClass(className) {
    return `android=new UiSelector().className("${className}")`;
  }

  /**
   * Wait for an element and type a value into it.
   */
  async setValue(selector, value) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout: 15000 });
    await el.clearValue();
    await el.setValue(value);
  }

  /**
   * Wait for an element and tap it.
   */
  async tap(selector) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout: 15000 });
    await el.click();
  }

  /**
   * Hide the soft keyboard if it is currently shown (best-effort).
   */
  async hideKeyboardIfShown() {
    try {
      if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard();
      }
    } catch {
      // Not all drivers support isKeyboardShown; ignore.
    }
  }
}
