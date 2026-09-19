import { Before, After } from '@wdio/cucumber-framework';
import { startScenarioShots, snapResult } from '../../support/screenshot.js';

const APP_PACKAGE = 'com.sourcey.materialloginexample';
const LOGIN_ACTIVITY = 'com.sourcey.materiallogindemo.LoginActivity';

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
Before(async (scenario) => {
  try {
    await driver.terminateApp(APP_PACKAGE);
  } catch {
    // App may not be running yet on the very first scenario; ignore.
  }
  await driver.startActivity(APP_PACKAGE, LOGIN_ACTIVITY);

  const name = scenario && scenario.pickle && scenario.pickle.name
    ? scenario.pickle.name
    : 'scenario';
  startScenarioShots(name);
});

/**
 * Capture a final PASSED/FAILED screenshot at the end of every scenario.
 */
After(async (scenario) => {
  const status = scenario && scenario.result && scenario.result.status
    ? scenario.result.status
    : 'unknown';
  const name = scenario && scenario.pickle && scenario.pickle.name
    ? scenario.pickle.name
    : 'scenario';
  await snapResult(status, name);
});
