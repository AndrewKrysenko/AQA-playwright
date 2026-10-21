import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-01 Успішна реєстрація з граничними коректними значеннями', async ({ page }) => {
    const email = `aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
    const password = 'Aa123456';

    // 1. Відкрити сайт із наданим доступом guest / welcome2qauto та відкрити форму Sign up → Registration.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();

    // 2. Ввести граничні коректні значення та перевірити, що Register активна.
    await page.locator('#signupName').fill('Al');
    await page.locator('#signupLastName').fill('ABCDEFGHIJKLMNOPQRST');
    await registrationDialog.getByRole('textbox', { name: 'Name Last name Email' }).fill(email);
    await registrationDialog.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    await registrationDialog.getByRole('textbox', { name: 'Re-enter password' }).fill(password);
    await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeEnabled();

    // 3. Натиснути Register.
    await registrationDialog.getByRole('button', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/panel\/garage$/);
  });
});
