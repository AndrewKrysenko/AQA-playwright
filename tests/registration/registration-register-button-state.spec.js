import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-08 Перевірка стану кнопки Register при виправленні помилки', async ({ page }) => {
    // 1. Заповнити форму валідними значеннями, крім некоректного Email.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();
    await page.locator('#signupName').fill('Ada');
    await page.locator('#signupLastName').fill('Lovelace');
    const email = registrationDialog.getByRole('textbox', { name: 'Name Last name Email' });
    await email.fill('invalid-email');
    await registrationDialog.getByRole('textbox', { name: 'Password', exact: true }).fill('Aa123456');
    await registrationDialog.getByRole('textbox', { name: 'Re-enter password' }).fill('Aa123456');
    await page.locator('#signupName').click();

    await expect(registrationDialog.getByText('Email is incorrect')).toBeVisible();
    const registerButton = registrationDialog.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeDisabled();

    // 2. Виправити Email і перевірити активацію Register.
    await email.fill(`aqa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`);
    await expect(registrationDialog.getByText('Email is incorrect')).toBeHidden();
    await expect(registerButton).toBeEnabled();
  });
});
