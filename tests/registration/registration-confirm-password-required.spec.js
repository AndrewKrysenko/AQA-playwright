import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-07 Перевірка обов’язковості повторного пароля', async ({ page }) => {
    // 1. Відкрити форму Registration.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();

    // 2. Заповнити інші поля валідними значеннями, а підтвердження залишити порожнім.
    await page.locator('#signupName').fill('Ada');
    await page.locator('#signupLastName').fill('Lovelace');
    await registrationDialog.getByRole('textbox', { name: 'Name Last name Email' }).fill(
      `aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`,
    );
    await registrationDialog.getByRole('textbox', { name: 'Password', exact: true }).fill('Aa123456');
    const confirmation = registrationDialog.getByRole('textbox', { name: 'Re-enter password' });
    await confirmation.click();
    await page.locator('#signupName').click();

    await expect(registrationDialog.getByText('Re-enter password required')).toBeVisible();
    await expect(confirmation).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeDisabled();
  });
});
