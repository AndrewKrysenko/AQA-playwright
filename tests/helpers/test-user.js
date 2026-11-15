import { randomUUID } from 'node:crypto';

export function createTestUser() {
  const password = `Aa1${randomUUID().replaceAll('-', '').slice(0, 8)}`;

  return {
    name: 'Network',
    lastName: 'Tester',
    email: `playwright-${randomUUID()}@example.test`,
    password,
    repeatPassword: password,
  };
}
