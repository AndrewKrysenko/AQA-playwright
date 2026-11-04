import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-04 Перевірка формату email', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // 1. Відкрити форму Registration.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();

    // 2. Перевірити неправильні формати email, помилкову рамку та недоступність Register.
    for (const value of ['aqa-no-at-test.com', '@test.com', 'aqa-user@']) {
      await registrationPage.fillEmail(value);
      await registrationPage.focusPassword();
      await expect(registrationPage.error('Email is incorrect')).toBeVisible();
      await expect(registrationPage.email).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      await expect(registrationPage.registerButton).toBeDisabled();
    }

    // 3. Ввести валідний унікальний email із префіксом aqa- та перевірити зникнення помилки.
    const validEmail = `aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
    await registrationPage.fillEmail(validEmail);
    await registrationPage.focusPassword();
    await expect(registrationPage.error('Email is incorrect')).toBeHidden();
  });
});
