import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'expect-webdriverio';
import LoginPage from '../../pageobjects/login.page.js';
import SignupPage from '../../pageobjects/signup.page.js';

Given('the app is launched on the login screen', async () => {
  await expect(await LoginPage.inputEmail).toBeDisplayed();
});

When(
  'I login with email {string} and password {string}',
  async (email, password) => {
    await LoginPage.login(email, password);
  }
);

When('I tap the signup link', async () => {
  await LoginPage.goToSignup();
});

Then('I should see the email field', async () => {
  await expect(await LoginPage.inputEmail).toBeDisplayed();
});

Then('I should see the login button', async () => {
  await expect(await LoginPage.btnLogin).toBeDisplayed();
});

Then('the login should be processed', async () => {
  // With valid credentials the app shows an "Authenticating..." progress dialog
  // and then navigates to MainActivity. We wait until we are no longer on the
  // LoginActivity, which is the real evidence that the login was processed.
  await driver.waitUntil(
    async () => {
      const activity = await driver.getCurrentActivity();
      return activity && activity.includes('MainActivity');
    },
    {
      timeout: 20000,
      timeoutMsg: 'The app did not navigate to MainActivity after login',
    }
  );
  const activity = await driver.getCurrentActivity();
  await expect(activity).toContain('MainActivity');
});

Then('I should remain in the login example app', async () => {
  // Second assertion: we are still inside the app package after logging in.
  const pkg = await driver.getCurrentPackage();
  await expect(pkg).toBe('com.sourcey.materialloginexample');
});

Then('I should see the signup form', async () => {
  await expect(await SignupPage.inputName).toBeDisplayed();
});
