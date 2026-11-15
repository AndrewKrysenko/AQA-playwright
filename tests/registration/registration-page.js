export class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');
    this.heading = this.dialog.getByRole('heading', { name: 'Registration' });
    this.name = page.locator('#signupName');
    this.lastName = page.locator('#signupLastName');
    this.email = this.dialog.getByRole('textbox', { name: 'Name Last name Email' });
    this.password = this.dialog.getByRole('textbox', { name: 'Password', exact: true });
    this.passwordConfirmation = this.dialog.getByRole('textbox', { name: 'Re-enter password' });
    this.registerButton = this.dialog.getByRole('button', { name: 'Register' });
  }

  async open() {
    await this.page.goto('/');
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }

  error(message) {
    return this.dialog.getByText(message, { exact: true });
  }

  async fillName(value) {
    await this.name.fill(value);
  }

  async fillLastName(value) {
    await this.lastName.fill(value);
  }

  async fillEmail(value) {
    await this.email.fill(value);
  }

  async fillPassword(value) {
    await this.password.fill(value);
  }

  async fillPasswordConfirmation(value) {
    await this.passwordConfirmation.fill(value);
  }

  async focusName() {
    await this.name.click();
  }

  async focusLastName() {
    await this.lastName.click();
  }

  async focusEmail() {
    await this.email.click();
  }

  async focusPassword() {
    await this.password.click();
  }

  async focusPasswordConfirmation() {
    await this.passwordConfirmation.click();
  }

  async submit() {
    await this.registerButton.click();
  }
}
