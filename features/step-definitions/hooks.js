import { Before, After } from '@wdio/cucumber-framework';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const APP_PACKAGE = 'com.sourcey.materialloginexample';
const LOGIN_ACTIVITY = 'com.sourcey.materiallogindemo.LoginActivity';
const SCREENSHOTS_DIR = join(process.cwd(), 'screenshots');

/**
 * Reset the app to a clean Login screen before every scenario.
 *
 * Scenarios share a single app session, so without this the app would stay on
 * whatever screen the previous scenario left it on (e.g. the signup screen),
 * breaking the "Given the app is launched on the login screen" precondition.
 *
 * Terminating and relaunching the activity gives each scenario a deterministic
 * starting point on LoginActivity.
 */
Before(async () => {
  try {
    await driver.terminateApp(APP_PACKAGE);
  } catch {
    // App may not be running yet on the very first scenario; ignore.
  }
  await driver.startActivity(APP_PACKAGE, LOGIN_ACTIVITY);
});

/**
 * Capture a screenshot at the end of every scenario as visual evidence.
 * Files are saved to ./screenshots/<PASSED|FAILED>_<scenario name>.png.
 */
After(async (scenario) => {
  try {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    const status = scenario.result && scenario.result.status
      ? String(scenario.result.status).toUpperCase()
      : 'UNKNOWN';
    const name = (scenario.pickle && scenario.pickle.name ? scenario.pickle.name : 'scenario')
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80);
    const file = join(SCREENSHOTS_DIR, `${status}_${name}.png`);
    await driver.saveScreenshot(file);
  } catch {
    // Never let screenshot capture fail the scenario.
  }
});
