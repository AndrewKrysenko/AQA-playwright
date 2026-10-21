import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-05 Перевірка довжини та складу пароля', async ({ page }) => {
    // 1. Відкрити форму Registration.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();
    const password = registrationDialog.getByRole('textbox', { name: 'Password', exact: true });
    const passwordConfirmation = registrationDialog.getByRole('textbox', { name: 'Re-enter password' });
    const passwordError = registrationDialog.getByText(
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
    );

    // 2. Перевірити паролі поза дозволеною довжиною.
    for (const value of ['Aa12345', 'Aa12345678901234']) {
      await password.fill(value);
      await passwordConfirmation.click();
      await expect(passwordError).toBeVisible();
      await expect(password).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeDisabled();
    }

    // 3. Перевірити пароль без цифри, великої літери або малої літери.
    for (const value of ['Abcdefgh', 'abcd1234', 'ABCD1234']) {
      await password.fill(value);
      await passwordConfirmation.click();
      await expect(passwordError).toBeVisible();
      await expect(password).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeDisabled();
    }

    // 4. Перевірити валідний пароль граничної довжини 15 символів.
    await password.fill('Aa1234567890123');
    await passwordConfirmation.click();
    await expect(passwordError).toBeHidden();
  });
});
