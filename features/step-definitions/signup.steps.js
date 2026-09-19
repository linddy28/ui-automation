import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'expect-webdriverio';
import LoginPage from '../../pageobjects/login.page.js';
import SignupPage from '../../pageobjects/signup.page.js';
import { snap } from '../../support/screenshot.js';

Given('I navigate to the signup screen', async () => {
  await LoginPage.goToSignup();
  await expect(await SignupPage.inputName).toBeDisplayed();
  await snap('signup_screen');
});

When('I register with the following data', async (dataTable) => {
  const row = dataTable.hashes()[0];
  await SignupPage.register({
    name: row.name,
    address: row.address,
    email: row.email,
    mobile: row.mobile,
    password: row.password,
    reEnterPassword: row.reEnterPassword ?? row.password,
  });
  await snap('after_signup_submit');
});

Then('I should see the name field', async () => {
  await expect(await SignupPage.inputName).toBeDisplayed();
  await snap('name_field_visible');
});

Then('I should see the signup button', async () => {
  await expect(await SignupPage.btnSignup).toBeDisplayed();
  await snap('signup_button_visible');
});

Then('the registration should be processed', async () => {
  // After tapping SIGNUP the app shows a "Creating Account..." progress dialog
  // for a couple of seconds and then leaves the signup screen. We wait until we
  // are no longer on SignupActivity, which is the real evidence the submit was
  // processed.
  await driver.waitUntil(
    async () => {
      const activity = await driver.getCurrentActivity();
      return activity && !activity.includes('SignupActivity');
    },
    {
      timeout: 20000,
      timeoutMsg: 'The app did not leave SignupActivity after submitting',
    }
  );
  const activity = await driver.getCurrentActivity();
  await expect(activity).not.toContain('SignupActivity');
  await snap('registration_processed');
});

Then('I should remain in the application', async () => {
  // Second assertion: confirm we are still inside the app package.
  const pkg = await driver.getCurrentPackage();
  await expect(pkg).toBe('com.sourcey.materialloginexample');
});
