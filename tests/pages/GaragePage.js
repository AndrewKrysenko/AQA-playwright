export class GaragePage {
  constructor(page) {
    this.page = page;
    this.authenticatedNotice = page.getByText('Logged in as guest, any changes will be lost!', { exact: true });
    this.heading = page.getByRole('heading', { name: 'Garage', exact: true });
    this.addCarButton = page.getByRole('button', { name: 'Add car', exact: true });
  }

  async open() {
    await this.page.goto('/panel/garage');
  }
}
