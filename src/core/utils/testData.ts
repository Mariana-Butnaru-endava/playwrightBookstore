import { env } from '@config/env';

export interface TestUser {
  userName: string;
  password: string;
}

function generateUsername(prefix = 'autouser'): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
}

export function generateUser(): TestUser {
  return {
    userName: generateUsername(),
    password: env.defaultPassword
  };
}
