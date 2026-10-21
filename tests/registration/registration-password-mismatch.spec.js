import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-06 Перевірка невідповідності паролів', async ({ page }) => {
    // 1. Відкрити форму Registration.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();

    // 2. Ввести валідні дані, крім повторного пароля, який має відрізнятися.
    await page.locator('#signupName').fill('Ada');
    await page.locator('#signupLastName').fill('Lovelace');
    await registrationDialog.getByRole('textbox', { name: 'Name Last name Email' }).fill(
      `aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`,
    );
    await registrationDialog.getByRole('textbox', { name: 'Password', exact: true }).fill('Aa123456');
    const confirmation = registrationDialog.getByRole('textbox', { name: 'Re-enter password' });
    await confirmation.fill('Aa123457');
    await page.locator('#signupName').click();

    await expect(registrationDialog.getByText('Passwords do not match')).toBeVisible();
    await expect(confirmation).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeDisabled();
  });
});
