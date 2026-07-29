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
  console.log('created user: ', createdUser.username);
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
  test('add book from UI to account, when book not already existent in account',
    async ({ page, accountApi, testUser }) => {
      const { createdUser, tokenResponse, profilePage } = await loginWithNewUser(page, accountApi, testUser);

      try {
        const booksPage = new BooksPage(page);

        await profilePage.goToBookstore();
        await booksPage.expectLoaded();

        // get all existent book titles in library
        const allVisibleBookTitles = await booksPage.getVisibleBookTitles();
        console.log('all book titles:', allVisibleBookTitles);
        expect(allVisibleBookTitles).toContain('Git Pocket Guide');
        console.log('all book titles count:', allVisibleBookTitles.length);
        expect(allVisibleBookTitles.length).toBe(8);

        //add a book to account
        const addBook = await booksPage.addBookToAccount('Git Pocket Guide');
        console.log('status:', addBook.status);
        expect(addBook.status).toMatch(/added/i);
        console.log('message:', addBook.message);
        expect(addBook.message).toContain('Book added to your collection.');

        //verify book exist in account
        const booksInAccount = await profilePage.getBooksFromAccount();
        console.log('books in account after adding a book:', booksInAccount);
        expect(booksInAccount.length).toBe(1);
        expectGroupToContain(booksInAccount, 'Git Pocket Guide');

        //delete book from account
        const deleteBook = await profilePage.deleteBookByTitle('Git Pocket Guide');
        expect(deleteBook).toContain('Book deleted.');

        //verify book deleted from account
        await profilePage.expectTableVisible();
        const finalBookTitles = await profilePage.getBooksFromAccount();
        console.log('final book titles in account:', finalBookTitles);
        console.log('final book titles count:', finalBookTitles.length);
        expect(finalBookTitles.length).toBe(0);
        expect(finalBookTitles).not.toContain('Git Pocket Guide');

        //await profilePage.goToBookstore();
        //await booksPage.expectLoaded();
        //await booksPage.addBookToAccount('Git Pocket Guide');
      } finally {
        await profilePage.logout().catch(() => { });
        //delete user is not working for the application, returning 401
        await accountApi.deleteUser(createdUser.userID, tokenResponse.token).catch(() => { });
        const userResponse = await accountApi.getUser(createdUser.userID, tokenResponse.token);
        console.log(`User profile response after deletion: ${JSON.stringify(userResponse.json())}`);
        console.log(`userResponse.status(): ${userResponse.status()}`);
      }
    });

  test('add books from UI, when book is already existent in account',
    async ({ page, accountApi, testUser }) => {
      test.slow();
      const { createdUser, tokenResponse, profilePage } = await loginWithNewUser(page, accountApi, testUser);
      // not working at this point to return to API operations, might be token change
      // const addBooksResponse = await bookStoreApi.addBooks(
      //   createdUser.userID,
      //   [knownBooks.gitPocketGuide, knownBooks.learningJavaScriptDesignPatterns],
      //   tokenResponse.token
      // );
      // expect(addBooksResponse.ok()).toBeTruthy();

      try {
        const booksPage = new BooksPage(page);
        await profilePage.expectTableVisible();
        await profilePage.goToBookstore();
        await booksPage.expectLoaded();

        //add book from UI
        var addBook = await booksPage.addBookToAccount('Git Pocket Guide');
        console.log('status:', addBook.status);
        console.log('message:', addBook.message);
        const initialNrOfBooksInAccount = await profilePage.getBooksFromAccount();
        console.log('Initial nr of books in account:', initialNrOfBooksInAccount.length);
        expect(initialNrOfBooksInAccount.length).toBe(1);

        //try to add again the same book
        addBook = await booksPage.addBookToAccount('Git Pocket Guide');
        console.log('status:', addBook.status);
        console.log('message:', addBook.message);
        expect(addBook.status).toMatch(/alreadyPresent/i);
        expect(addBook.message).toContain('Book already present in the your collection!');

        //validate same nr of books in account, as book was already existent
        const booksInAccount = await profilePage.getBooksFromAccount();
        console.log('books in account after adding an existent book:', booksInAccount);

        if (addBook.status === 'alreadyPresent') {
          expect(booksInAccount.length).toBe(initialNrOfBooksInAccount.length);
        }
        expect(booksInAccount).toContain('Git Pocket Guide');

        //delete book from account
        await profilePage.deleteBookByTitle('Git Pocket Guide');
        await profilePage.expectTableVisible();
        const finalBookTitles = await profilePage.getBooksFromAccount();
        console.log('final book titles in account:', finalBookTitles);
        console.log('final book titles count:', finalBookTitles.length);
        expect(finalBookTitles.length).toBe(0);
        expect(finalBookTitles).not.toContain('Git Pocket Guide');
        await profilePage.deleteAllBooks().catch(() => { });
      } finally {
        await profilePage.logout().catch(() => { });
        await accountApi.deleteUser(createdUser.userID, tokenResponse.token).catch(() => { });
      }
    });
});