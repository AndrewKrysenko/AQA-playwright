import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-03 Перевірка правил Name і Last name', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // 1. Відкрити форму реєстрації.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();

    // 2. Перевірити неанглійські символи та довжини поза діапазоном для обох полів.
    const fields = [
      {
        locator: registrationPage.name,
        fill: (value) => registrationPage.fillName(value),
        invalidMessage: 'Name is invalid',
        lengthMessage: 'Name has to be from 2 to 20 characters long',
      },
      {
        locator: registrationPage.lastName,
        fill: (value) => registrationPage.fillLastName(value),
        invalidMessage: 'Last name is invalid',
        lengthMessage: 'Last name has to be from 2 to 20 characters long',
      },
    ];

    for (const { locator, fill, invalidMessage, lengthMessage } of fields) {
      for (const [value, expectedMessage] of [
        ['Él', invalidMessage],
        ['A', lengthMessage],
        ['ABCDEFGHIJKLMNOPQRSTU', lengthMessage],
      ]) {
        await fill(value);
        await registrationPage.focusEmail();
        await expect(registrationPage.error(expectedMessage)).toBeVisible();
        await expect(locator).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(registrationPage.registerButton).toBeDisabled();
      }
    }

    // 3. Перевірити межі 2 та 20 символів і trim пробілів на краях.
    for (const { fill, invalidMessage, lengthMessage } of fields) {
      for (const value of ['Ab', 'ABCDEFGHIJKLMNOPQRST', '  Ab  ']) {
        await fill(value);
        await registrationPage.focusEmail();
        await expect(registrationPage.error(invalidMessage)).toBeHidden();
        await expect(registrationPage.error(lengthMessage)).toBeHidden();
      }
    }
  });
});
