import { test, expect } from '@playwright/test';
import { RegistrationPage } from './registration-page.js';

test.describe('Реєстрація нового користувача', () => {
  test('REG-02 Перевірка обов’язковості всіх полів', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // 1. Відкрити форму Registration та залишити всі поля порожніми.
    await registrationPage.open();
    await expect(registrationPage.heading).toBeVisible();

    // 2. Запустити валідацію, перевірити обов’язкові поля, червоні рамки та кнопку Register.
    await registrationPage.focusName();
    await registrationPage.focusLastName();
    await registrationPage.focusEmail();
    await registrationPage.focusPassword();
    await registrationPage.focusPasswordConfirmation();
    await registrationPage.focusName();

    await expect(registrationPage.error('Name required')).toBeVisible();
    await expect(registrationPage.error('Last name required')).toBeVisible();
    await expect(registrationPage.error('Email required')).toBeVisible();
    await expect(registrationPage.error('Password required')).toBeVisible();
    await expect(registrationPage.error('Re-enter password required')).toBeVisible();
    await expect(registrationPage.registerButton).toBeDisabled();
    for (const field of [registrationPage.name, registrationPage.lastName, registrationPage.email, registrationPage.password, registrationPage.passwordConfirmation]) {
      await expect(field).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    }
  });
});
