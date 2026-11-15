import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-06 Перевірка невідповідності паролів', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // 1. Відкрити форму Registration.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();

    // 2. Ввести валідні дані, крім повторного пароля, який має відрізнятися.
    await registrationPage.fillName('Ada');
    await registrationPage.fillLastName('Lovelace');
    await registrationPage.fillEmail(`aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`);
    await registrationPage.fillPassword('Aa123456');
    await registrationPage.fillPasswordConfirmation('Aa123457');
    await registrationPage.focusName();

    await expect(registrationPage.error('Passwords do not match')).toBeVisible();
    await expect(registrationPage.passwordConfirmation).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationPage.registerButton).toBeDisabled();
  });
});
