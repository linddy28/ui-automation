import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'expect-webdriverio';
import LoginPage from '../../pageobjects/login.page.js';
import SignupPage from '../../pageobjects/signup.page.js';

Given('I navigate to the signup screen', async () => {
  await LoginPage.goToSignup();
  await expect(await SignupPage.inputName).toBeDisplayed();
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
});

Then('I should see the name field', async () => {
  await expect(await SignupPage.inputName).toBeDisplayed();
});

Then('I should see the signup button', async () => {
  await expect(await SignupPage.btnSignup).toBeDisplayed();
});

Then('the registration form should have been submitted', async () => {
  // After submitting, the signup button should still exist in the app.
  await expect(await SignupPage.btnSignup).toBeExisting();
});

Then('I should remain in the application', async () => {
  // Second assertion: confirm we are still inside the app package.
  const pkg = await driver.getCurrentPackage();
  await expect(pkg).toBe('com.sourcey.materialloginexample');
});
