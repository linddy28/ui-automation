import Page from './page.js';

/**
 * Page Object for the Login screen (LoginActivity).
 * Resource ids confirmed from the APK: input_email, input_password,
 * btn_login, link_signup.
 */
class LoginPage extends Page {
  get inputEmail() {
    return $(this.byId('input_email'));
  }

  get inputPassword() {
    return $(this.byId('input_password'));
  }

  get btnLogin() {
    return $(this.byId('btn_login'));
  }

  get linkSignup() {
    return $(this.byId('link_signup'));
  }

  /**
   * Perform a full login with the given credentials.
   */
  async login(email, password) {
    await this.setValue(this.byId('input_email'), email);
    await this.setValue(this.byId('input_password'), password);
    await this.hideKeyboardIfShown();
    await this.tap(this.byId('btn_login'));
  }

  /**
   * Navigate from the Login screen to the Signup screen.
   */
  async goToSignup() {
    await this.tap(this.byId('link_signup'));
  }

  /**
   * Whether the login form is currently displayed.
   */
  async isDisplayed() {
    return (await this.inputEmail).isDisplayed();
  }
}

export default new LoginPage();
