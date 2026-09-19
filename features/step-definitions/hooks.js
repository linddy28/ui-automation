import { Before } from '@wdio/cucumber-framework';

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
Before(async () => {
  try {
    await driver.terminateApp(APP_PACKAGE);
  } catch {
    // App may not be running yet on the very first scenario; ignore.
  }
  await driver.startActivity(APP_PACKAGE, LOGIN_ACTIVITY);
});
