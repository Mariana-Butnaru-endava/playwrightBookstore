import type { Page } from '@playwright/test';
import { AccountApi } from '@core/api/accountApi';
import { TestUser } from '@core/utils/testData';
import { expectGroupToContain } from '@core/utils/assertions';
import { test, expect } from '@fixtures/testFixtures';
import { BooksPage } from '@pages/booksPage';
import { LoginPage } from '@pages/loginPage';
import { ProfilePage } from '@pages/profilePage';

async function loginWithNewUser(page: Page, accountApi: AccountApi, testUser: TestUser) {
  const createdUser = await accountApi.createUser(testUser);
  const tokenResponse = await accountApi.generateToken(testUser);

  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);

  await profilePage.goto();
  await profilePage.waitForLoaded();
  await profilePage.clickOnLoginLink();
  await loginPage.login(testUser.userName, testUser.password);

  await profilePage.waitForLoaded();
  await profilePage.expectUsername(createdUser.username);
  await profilePage.expectLogoutVisible();

  return { createdUser, tokenResponse, loginPage, profilePage };
}

test.describe('Login from profile and add book', () => {
  test('add books from UI to account when no books already existent in account',
    async ({ page, accountApi, testUser }) => {
      const { createdUser, tokenResponse, profilePage, loginPage } = await loginWithNewUser(page, accountApi, testUser);

      try {
        const booksPage = new BooksPage(page);

        await profilePage.goToBookstore();
        await booksPage.expectLoaded();
        const allVisibleBookTitles = await booksPage.getVisibleBookTitles();
        console.log('all book titles:', allVisibleBookTitles);
        console.log('all book titles count:', allVisibleBookTitles.length);

        const addBook = await booksPage.addBookToAccount('Git Pocket Guide');
        console.log('status:', addBook.status);
        console.log('message:', addBook.message);

        const booksInAccount = await profilePage.getBooksFromAccount();
        console.log('books in account after adding a book:', booksInAccount);
        expectGroupToContain(booksInAccount, 'Git Pocket Guide');
        await profilePage.deleteBookByTitle('Git Pocket Guide');

        await profilePage.goToBookstore();
        await booksPage.expectLoaded();
        await booksPage.addBookToAccount('Git Pocket Guide');
      } finally {
        await profilePage.logout().catch(() => {});
        await accountApi.deleteUser(createdUser.userID, tokenResponse.token).catch(() => {});
      }
    });

  test('add books when there are already books in account', async ({ page, accountApi, testUser }) => {
    test.slow();
    const { createdUser, tokenResponse, profilePage } = await loginWithNewUser(page, accountApi, testUser);

    try {
      const booksPage = new BooksPage(page);

      await profilePage.expectTableVisible();
      const initialNrOfBooksInAccount = await profilePage.getBooksFromAccount();

      console.log('Initial nr of books in account:', initialNrOfBooksInAccount.length);

      await profilePage.goToBookstore();
      await booksPage.expectLoaded();
      const allVisibleBookTitles = await booksPage.getVisibleBookTitles();
      console.log('all book titles:', allVisibleBookTitles);
      console.log('all book titles count:', allVisibleBookTitles.length);

      const addBook = await booksPage.addBookToAccount('Git Pocket Guide');
      console.log('status:', addBook.status);
      console.log('message:', addBook.message);

      const booksInAccount = await profilePage.getBooksFromAccount();
      console.log('books in account after adding an existent book:', booksInAccount);
      if (addBook.status === 'alreadyPresent') {
        expect(booksInAccount.length).toBe(initialNrOfBooksInAccount.length);
      }

      expectGroupToContain(booksInAccount, 'Git Pocket Guide');
      await profilePage.deleteBookByTitle('Git Pocket Guide');
      await profilePage.expectTableVisible();
      const finalBookTitles = await profilePage.getBooksFromAccount();
      console.log('final book titles in account:', finalBookTitles);
      console.log('final book titles count:', finalBookTitles.length);
      expect(finalBookTitles).not.toContain('Git Pocket Guide');
      await profilePage.deleteAllBooks().catch(() => {});
    } finally {
      await profilePage.logout().catch(() => {});
      await accountApi.deleteUser(createdUser.userID, tokenResponse.token).catch(() => {});
    }
  });
});