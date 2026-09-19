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

Then('the login button should still be present', async () => {
  await expect(await LoginPage.btnLogin).toBeExisting();
});

Then('the login screen should remain interactive', async () => {
  // A second assertion for the scenario: the email field is still usable.
  await expect(await LoginPage.inputEmail).toBeDisplayed();
});

Then('I should see the signup form', async () => {
  await expect(await SignupPage.inputName).toBeDisplayed();
});

Then('I should see the signup button', async () => {
  await expect(await SignupPage.btnSignup).toBeDisplayed();
});
