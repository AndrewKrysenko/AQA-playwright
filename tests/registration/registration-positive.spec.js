import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-01 Успішна реєстрація з граничними коректними значеннями', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const email = `aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
    const password = 'Aa123456';

    // 1. Відкрити сайт із наданим доступом guest / welcome2qauto та відкрити форму Sign up → Registration.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();

    // 2. Ввести граничні коректні значення та перевірити, що Register активна.
    await registrationPage.fillName('Al');
    await registrationPage.fillLastName('ABCDEFGHIJKLMNOPQRST');
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword(password);
    await registrationPage.fillPasswordConfirmation(password);
    await expect(registrationPage.registerButton).toBeEnabled();

    // 3. Натиснути Register.
    await registrationPage.submit();
    await expect(page).toHaveURL(/panel\/garage$/);
  });
});
