import { test, expect } from '@playwright/test';

test.describe('Реєстрація нового користувача', () => {
  test('REG-03 Перевірка правил Name і Last name', async ({ page }) => {
    // 1. Відкрити форму реєстрації.
    await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    const registrationDialog = page.getByRole('dialog');
    await expect(registrationDialog.getByRole('heading', { name: 'Registration' })).toBeVisible();
    const email = registrationDialog.getByRole('textbox', { name: 'Name Last name Email' });

    // 2. Перевірити неанглійські символи та довжини поза діапазоном для обох полів.
    const fields = [
      {
        locator: page.locator('#signupName'),
        invalidMessage: 'Name is invalid',
        lengthMessage: 'Name has to be from 2 to 20 characters long',
      },
      {
        locator: page.locator('#signupLastName'),
        invalidMessage: 'Last name is invalid',
        lengthMessage: 'Last name has to be from 2 to 20 characters long',
      },
    ];

    for (const { locator, invalidMessage, lengthMessage } of fields) {
      for (const [value, expectedMessage] of [
        ['Él', invalidMessage],
        ['A', lengthMessage],
        ['ABCDEFGHIJKLMNOPQRSTU', lengthMessage],
      ]) {
        await locator.fill(value);
        await email.click();
        await expect(registrationDialog.getByText(expectedMessage, { exact: true })).toBeVisible();
        await expect(locator).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(registrationDialog.getByRole('button', { name: 'Register' })).toBeDisabled();
      }
    }

    // 3. Перевірити межі 2 та 20 символів і trim пробілів на краях.
    for (const { locator, invalidMessage, lengthMessage } of fields) {
      for (const value of ['Ab', 'ABCDEFGHIJKLMNOPQRST', '  Ab  ']) {
        await locator.fill(value);
        await email.click();
        await expect(registrationDialog.getByText(invalidMessage, { exact: true })).toBeHidden();
        await expect(registrationDialog.getByText(lengthMessage, { exact: true })).toBeHidden();
      }
    }
  });
});
