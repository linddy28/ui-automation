import Page from './page.js';

/**
 * Page Object for the Signup screen (SignupActivity).
 * Resource ids confirmed from the APK: input_name, input_address,
 * input_email, input_mobile, input_password, input_reEnterPassword,
 * btn_signup, link_login.
 */
class SignupPage extends Page {
  get inputName() {
    return $(this.byId('input_name'));
  }

  get inputAddress() {
    return $(this.byId('input_address'));
  }

  get inputEmail() {
    return $(this.byId('input_email'));
  }

  get inputMobile() {
    return $(this.byId('input_mobile'));
  }

  get inputPassword() {
    return $(this.byId('input_password'));
  }

  get inputReEnterPassword() {
    return $(this.byId('input_reEnterPassword'));
  }

  get btnSignup() {
    return $(this.byId('btn_signup'));
  }

  get linkLogin() {
    return $(this.byId('link_login'));
  }

  /**
   * Fill and submit the registration form.
   */
  async register({ name, address, email, mobile, password, reEnterPassword }) {
    await this.setValue(this.byId('input_name'), name);
    await this.setValue(this.byId('input_address'), address);
    await this.setValue(this.byId('input_email'), email);
    await this.setValue(this.byId('input_mobile'), mobile);
    await this.setValue(this.byId('input_password'), password);
    await this.setValue(
      this.byId('input_reEnterPassword'),
      reEnterPassword ?? password
    );
    await this.hideKeyboardIfShown();
    await this.tap(this.byId('btn_signup'));
  }

  /**
   * Whether the signup form is currently displayed.
   */
  async isDisplayed() {
    return (await this.btnSignup).isDisplayed();
  }
}

export default new SignupPage();
