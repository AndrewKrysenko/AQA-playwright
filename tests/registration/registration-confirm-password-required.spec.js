import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-07 Перевірка обов’язковості повторного пароля', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // 1. Відкрити форму Registration.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();

    // 2. Заповнити інші поля валідними значеннями, а підтвердження залишити порожнім.
    await registrationPage.fillName('Ada');
    await registrationPage.fillLastName('Lovelace');
    await registrationPage.fillEmail(`aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`);
    await registrationPage.fillPassword('Aa123456');
    await registrationPage.focusPasswordConfirmation();
    await registrationPage.focusName();

    await expect(registrationPage.error('Re-enter password required')).toBeVisible();
    await expect(registrationPage.passwordConfirmation).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationPage.registerButton).toBeDisabled();
  });
});
