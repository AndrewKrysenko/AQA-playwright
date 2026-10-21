import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-04 Перевірка формату email', async ({ page }) => {
    // 1. Відкрити форму Registration.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();
    const email = registrationDialog.getByRole('textbox', { name: 'Name Last name Email' });
    const password = registrationDialog.getByRole('textbox', { name: 'Password', exact: true });

    // 2. Перевірити неправильні формати email, помилкову рамку та недоступність Register.
    for (const value of ['aqa-no-at-test.com', '@test.com', 'aqa-user@']) {
      await email.fill(value);
      await password.click();
      await expect(registrationDialog.getByText('Email is incorrect')).toBeVisible();
      await expect(email).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeDisabled();
    }

    // 3. Ввести валідний унікальний email із префіксом aqa- та перевірити зникнення помилки.
    const validEmail = `aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
    await email.fill(validEmail);
    await password.click();
    await expect(registrationDialog.getByText('Email is incorrect')).toBeHidden();
  });
});
