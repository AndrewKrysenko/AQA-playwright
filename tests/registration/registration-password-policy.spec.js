import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-05 Перевірка довжини та складу пароля', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // 1. Відкрити форму Registration.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();
    const passwordError = registrationPage.error(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
    );

    // 2. Перевірити паролі поза дозволеною довжиною.
    for (const value of ['Aa12345', 'Aa12345678901234']) {
      await registrationPage.fillPassword(value);
      await registrationPage.focusPasswordConfirmation();
      await expect(passwordError).toBeVisible();
      await expect(registrationPage.password).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      await expect(registrationPage.registerButton).toBeDisabled();
    }

    // 3. Перевірити пароль без цифри, великої літери або малої літери.
    for (const value of ['Abcdefgh', 'abcd1234', 'ABCD1234']) {
      await registrationPage.fillPassword(value);
      await registrationPage.focusPasswordConfirmation();
      await expect(passwordError).toBeVisible();
      await expect(registrationPage.password).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      await expect(registrationPage.registerButton).toBeDisabled();
    }

    // 4. Перевірити валідний пароль граничної довжини 15 символів.
    await registrationPage.fillPassword('Aa1234567890123');
    await registrationPage.focusPasswordConfirmation();
    await expect(passwordError).toBeHidden();
  });
});
