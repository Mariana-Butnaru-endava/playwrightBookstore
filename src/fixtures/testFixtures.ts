import { test as base, expect } from '@playwright/test';
import { ApiClient } from '@core/api/apiClient';
import { AccountApi } from '@core/api/accountApi';
import { BookStoreApi } from '@core/api/bookstoreApi';
import { env } from '@config/env';
import { generateUser, TestUser } from '@core/utils/testData';
import { BooksPage } from '@pages/booksPage';
import { BookDetailsPage } from '@pages/bookDetailsPage';
import { LoginPage } from '@pages/loginPage';
import { ProfilePage } from '@pages/profilePage';

type ApiFixtures = {
  apiClient: ApiClient;
  accountApi: AccountApi;
  bookStoreApi: BookStoreApi;
  testUser: TestUser;
};

type UiFixtures = {
  booksPage: BooksPage;
  bookDetailsPage: BookDetailsPage;
  loginPage: LoginPage;
  profilePage: ProfilePage;
};

export const test = base.extend<ApiFixtures & UiFixtures>({
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
  },

  booksPage: async ({ page }, use) => {
    await use(new BooksPage(page));
  },

  bookDetailsPage: async ({ page }, use) => {
    await use(new BookDetailsPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  }
});

export { expect };
