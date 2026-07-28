import { test as base, expect } from '@playwright/test';
import { ApiClient } from '@core/api/apiClient';
import { AccountApi } from '@core/api/accountApi';
import { BookStoreApi } from '@core/api/bookstoreApi';
import { env } from '@config/env';
import { generateUser, TestUser } from '@core/utils/testData';

type ApiFixtures = {
  apiClient: ApiClient;
  accountApi: AccountApi;
  bookStoreApi: BookStoreApi;
  testUser: TestUser;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({}, use) => {
    const client = await ApiClient.create(env.apiBaseUrl);
    await use(client);
    await client.dispose();
  },

  accountApi: async ({ apiClient }, use) => {
    await use(new AccountApi(apiClient));
  },

  bookStoreApi: async ({ apiClient }, use) => {
    await use(new BookStoreApi(apiClient));
  },

  testUser: async ({}, use) => {
    await use(generateUser());
  }
});

export { expect };
