import { test, expect } from '@fixtures/testFixtures';
import { knownBooks } from '@core/constants/books';
import { LoginPage } from '@pages/loginPage';
import { ProfilePage } from '@pages/profilePage';
import { promises as fs } from 'fs';
import * as path from 'path';
import { BooksPage } from '@pages/booksPage';
import { BookDetailsPage } from '@pages/bookDetailsPage';
import { expectGroupToContain } from '@core/utils/assertions';


test.describe('API to UI contract flow', () => {
  test('should show in UI the book added through backend API, delete book from UI',
    async ({ page, accountApi, bookStoreApi, testUser }) => {
      test.slow();
      const createdUser = await accountApi.createUser(testUser);
      console.log('Created user: ', createdUser.username);
      const tokenPayload = await accountApi.generateToken(testUser);
      expect(tokenPayload.token).not.toBeFalsy();

      const addBookResponse = await bookStoreApi.addBooks(
        createdUser.userID,
        [knownBooks.gitPocketGuide, knownBooks.learningJavaScriptDesignPatterns, knownBooks.designingEvolvableWebAPIs],
        tokenPayload.token
      );
      expect(addBookResponse.ok(), 'Books successfuly added to user account').toBeTruthy();

      var getUser = await accountApi.getUser(createdUser.userID, tokenPayload.token);
      var userPayload = await getUser.json();
      const savedResponsePath = path.join(process.cwd(), 'test-results', `getUser-${createdUser.userID}.json`);
      await fs.mkdir(path.dirname(savedResponsePath), { recursive: true });
      await fs.writeFile(savedResponsePath, JSON.stringify(userPayload, null, 2), 'utf-8');

      const savedUserPayload = JSON.parse(await fs.readFile(savedResponsePath, 'utf-8')) as {
        books: Array<{ title: string; author: string; publisher: string }>;
      };

      const loginPage = new LoginPage(page);
      const profilePage = new ProfilePage(page);

      await loginPage.goto();
      await loginPage.login(testUser.userName, testUser.password);

      await profilePage.waitForLoaded();
      await profilePage.expectUsername(createdUser.username);

      for (const book of savedUserPayload.books) {
        await profilePage.expectBookInAccount(book.title, book.author, book.publisher);
      }
      await profilePage.deleteBookByTitle('Learning JavaScript Design Patterns');
      let books = await profilePage.getBooksFromAccount();
      console.log('Books after 1 book deleted: ', books.length);

      await profilePage.deleteAllBooks();
      await profilePage.logout();
      await loginPage.goto();
      await loginPage.login(testUser.userName, testUser.password);

      await profilePage.waitForLoaded();
      books = await profilePage.getBooksFromAccount();
      console.log('Books after all deleted: ', books.length);
      expect(books.length).toBe(0);
      // getUser = await accountApi.getUser(createdUser.userID, tokenPayload.token);
      // console.log('Get user status: ', getUser.status());
      // userPayload = await getUser.json() as CreateUserResponse;
      // console.log('User after all books deleted from UI: ', userPayload);
      // expect(userPayload.books.length).toBe(0);
      //delete account from API
      await accountApi.deleteUser(createdUser.userID, tokenPayload.token).catch(() => {});
    });

  test('create user from API, add and delete book from UI',
    async ({ page, accountApi, testUser }) => {
      const createUser = await accountApi.createUser(testUser);
      console.log('username: ', createUser.username);

      const loginPage = new LoginPage(page);
      const profilePage = new ProfilePage(page);
      const booksPage = new BooksPage(page);
      await profilePage.goto();
      await profilePage.waitForLoaded();
      await profilePage.clickOnLoginLink();

      await loginPage.login(testUser.userName, testUser.password);
      await profilePage.goToBookstore();
      const addBook = await booksPage.addBookToAccount('Git Pocket Guide');
      console.log("status of adding: ", addBook.status, addBook.message);

      expect(addBook.status).toBe('added');
      //expect message
      console.log("message:", addBook.message);
      var booksInAccount = await profilePage.getBooksFromAccount();
      console.log("books in account after adding an existent book:", booksInAccount);
      expectGroupToContain(booksInAccount, 'Git Pocket Guide');
      expect(booksInAccount.length).toBe(1);
      //delete book
      const deleteMessage = await profilePage.deleteBookByTitle('Git Pocket Guide');
      expect(deleteMessage).toMatch(/Book deleted|unknown/i);
      booksInAccount = await profilePage.getBooksFromAccount();
      expect(booksInAccount.length).toBe(0);
    }
  );

  test('Should show in book detail page fields from API',
    async ({ page, bookStoreApi }) => {
      const bookDetail = await bookStoreApi.getBook(knownBooks.designingEvolvableWebAPIs);
      expect(bookDetail.ok()).toBeTruthy();
      const bookDetails = await bookDetail.json()
      console.log('API book details:', bookDetails);
      console.log('Titlu: ', bookDetails.title);

      const bookstorePage = new BooksPage(page);
      const detailsPage = new BookDetailsPage(page);
      await bookstorePage.goto();
      await bookstorePage.expectLoaded();
      await bookstorePage.openBookByTitle('Designing Evolvable Web APIs with ASP.NET');
      await detailsPage.expectTitle(bookDetails.title);

    });

  test('logout from UI account created through API', async ({ page, accountApi, testUser }) => {
    const createdUser = await accountApi.createUser(testUser);
    expect(createdUser.userID).not.toBeFalsy();
    console.log('username created: ', createdUser.username);

    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.goto();
    await loginPage.login(testUser.userName, testUser.password);
    await profilePage.waitForLoaded();
    await profilePage.expectLogoutVisible();
    await profilePage.logout();

    await loginPage.waitForLoaded();
  })
});
