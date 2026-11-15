import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-08 Перевірка стану кнопки Register при виправленні помилки', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // 1. Заповнити форму валідними значеннями, крім некоректного Email.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();
    await registrationPage.fillName('Ada');
    await registrationPage.fillLastName('Lovelace');
    await registrationPage.fillEmail('invalid-email');
    await registrationPage.fillPassword('Aa123456');
    await registrationPage.fillPasswordConfirmation('Aa123456');
    await registrationPage.focusName();

    await expect(registrationPage.error('Email is incorrect')).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();

    // 2. Виправити Email і перевірити активацію Register.
    await registrationPage.fillEmail(`aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`);
    await expect(registrationPage.error('Email is incorrect')).toBeHidden();
    await expect(registrationPage.registerButton).toBeEnabled();
  });
});
