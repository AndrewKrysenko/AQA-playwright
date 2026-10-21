import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-02 Перевірка обов’язковості всіх полів', async ({ page }) => {
    // 1. Відкрити форму Registration та залишити всі поля порожніми.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();

    // 2. Запустити валідацію, перевірити обов’язкові поля, червоні рамки та кнопку Register.
    const name = page.locator('#signupName');
    const lastName = page.locator('#signupLastName');
    const email = registrationDialog.getByRole('textbox', { name: 'Name Last name Email' });
    const password = registrationDialog.getByRole('textbox', { name: 'Password', exact: true });
    const passwordConfirmation = registrationDialog.getByRole('textbox', { name: 'Re-enter password' });

    await name.click();
    await lastName.click();
    await email.click();
    await password.click();
    await passwordConfirmation.click();
    await name.click();

    await expect(registrationDialog.getByText('Name required', { exact: true })).toBeVisible();
    await expect(registrationDialog.getByText('Last name required', { exact: true })).toBeVisible();
    await expect(registrationDialog.getByText('Email required', { exact: true })).toBeVisible();
    await expect(registrationDialog.getByText('Password required', { exact: true })).toBeVisible();
    await expect(registrationDialog.getByText('Re-enter password required', { exact: true })).toBeVisible();
    await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeDisabled();
    for (const field of [name, lastName, email, password, passwordConfirmation]) {
      await expect(field).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    }
  });
});
