import { join } from 'node:path';

/**
 * WebdriverIO configuration for Android UI automation.
 * Framework: Cucumber (BDD) + Appium (UiAutomator2) + Page Object Model.
 *
 * The APK path can be overridden with the APK_PATH environment variable
 * (useful in CI). By default it points to the app bundled in ./app.
 */
const APK_PATH =
  process.env.APK_PATH || join(process.cwd(), 'app', 'MaterialLoginExample.apk');

export const config = {
  runner: 'local',

  // -------------------------------------------------------------------------
  // Test files
  // -------------------------------------------------------------------------
  specs: ['./features/**/*.feature'],
  exclude: [],

  maxInstances: 1,

  // -------------------------------------------------------------------------
  // Capabilities (Android + UiAutomator2)
  // -------------------------------------------------------------------------
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
      'appium:platformVersion': process.env.PLATFORM_VERSION || undefined,
      'appium:app': APK_PATH,
      'appium:appPackage': 'com.sourcey.materialloginexample',
      'appium:appActivity': 'com.sourcey.materiallogindemo.LoginActivity',
      'appium:appWaitActivity':
        'com.sourcey.materiallogindemo.LoginActivity,com.sourcey.materiallogindemo.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 240,
    },
  ],

  // -------------------------------------------------------------------------
  // Test settings
  // -------------------------------------------------------------------------
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Appium is managed by the appium-service so we don't have to start it
  // manually. Comment this out if you prefer to run `npm run appium` yourself.
  services: [
    [
      'appium',
      {
        args: {
          allowInsecure: 'adb_shell',
        },
        logPath: './logs',
      },
    ],
  ],

  port: 4723,

  framework: 'cucumber',
  reporters: ['spec'],

  cucumberOpts: {
    require: ['./features/step-definitions/**/*.js'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 90000,
    ignoreUndefinedDefinitions: false,
  },
};
