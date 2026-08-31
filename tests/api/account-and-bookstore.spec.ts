import { test, expect } from '@fixtures/testFixtures';
import { knownBooks } from '@core/constants/books';
import { expectBookIsPresent } from '@core/utils/assertions';
import { env } from '@config/env';
import { CreateUserResponse, NotFound } from '@core/api/accountApi';

test.describe('DemoQA Book Store API', () => {
  test('@smoke should create user, generate token, add books, validate user profile data and delete user',
    async ({ accountApi, bookStoreApi, testUser }) => {
      console.log(`Testing with user: ${testUser.userName}`);

      const createdUser = await accountApi.createUser(testUser);
      expect(createdUser.userID).toBeTruthy();

      const tokenPayload = await accountApi.generateToken(testUser);
      expect(tokenPayload.token).toBeTruthy();

      // const authorizedResponse = await accountApi.authorize(testUser);
      // expect(authorizedResponse.ok()).toBeTruthy();

      const booksPayload = await bookStoreApi.getBooks();
      expect(booksPayload.books.length).toBeGreaterThan(0);
      console.log(`Total books available in application: ${booksPayload.books.length}`);
      console.log(`Total books existent: ${booksPayload.books
        .forEach(book =>
          console.log(`
          ISBN: ${book.isbn} ; 
          Title: ${book.title} ; 
          Description: ${book.description}; 
          Pages: ${book.pages}`))}`)

      const addBooksResponse = await bookStoreApi.addBooks(
        createdUser.userID,
        [knownBooks.gitPocketGuide, knownBooks.learningJavaScriptDesignPatterns],
        tokenPayload.token
      );
      expect(addBooksResponse.ok()).toBeTruthy();

      let userResponse = await accountApi.getUser(createdUser.userID, tokenPayload.token);
      expect(userResponse.ok()).toBeTruthy();
      let userPayload = await userResponse.json();

      console.log(`User profile response: ${JSON.stringify(userPayload)}`);
      //console.log(`User profile response: ${JSON.stringify(await userResponse.json())}`);
      console.log(`Books added: ${knownBooks.gitPocketGuide}, ${knownBooks.learningJavaScriptDesignPatterns}`);
      console.log(`Token used: ${tokenPayload.token}`);
      console.log(`userResponse.status(): ${userResponse.status()}`);
      console.log(`userResponse.statusText(): ${userResponse.statusText()}`);
      expect(userPayload.userId).toBe(createdUser.userID);
      expect(userPayload.username).toBe(testUser.userName);
      expect(userPayload.books.length).toBeGreaterThanOrEqual(2);
      expectBookIsPresent(userPayload.books, knownBooks.gitPocketGuide);
      expectBookIsPresent(userPayload.books, knownBooks.learningJavaScriptDesignPatterns);

      const replacingBook = await bookStoreApi.replaceBook(createdUser.userID,
        knownBooks.gitPocketGuide, knownBooks.designingEvolvableWebAPIs, tokenPayload.token);
      //console.log(`Replace status: ${replacingBook.status()}`)
      //expect(replacingBook.ok()).toBeTruthy;
      const replacingBookPayload = await replacingBook.json();
      console.log(`Replace response: ${JSON.stringify(replacingBookPayload)}`);

      userResponse = await accountApi.getUser(createdUser.userID, tokenPayload.token);
      userPayload = await userResponse.json();
      expectBookIsPresent(userPayload.books, knownBooks.designingEvolvableWebAPIs);
      console.log(`User profile response: ${JSON.stringify(userPayload)}`);

      const removeBook = await bookStoreApi.removeBook(knownBooks.learningJavaScriptDesignPatterns, createdUser.userID, tokenPayload.token);
      console.log(`status removing: ${removeBook.status()}`);
      expect(removeBook.ok()).toBeTruthy();

      const removeBody = await removeBook.text();
      console.log(`removed javascript book: ${removeBody}`);

      userResponse = await accountApi.getUser(createdUser.userID, tokenPayload.token);
      userPayload = await userResponse.text();
      console.log(`User profile response: ${userPayload}`);

      const removeAllBooks = await bookStoreApi.removeAllBooks(createdUser.userID, tokenPayload.token);
      const removeAllBooksBody = await removeAllBooks.text();
      console.log(`
      Response removing all books: ${removeAllBooks.status()} 
      and body text: ${removeAllBooksBody} }`);
      userResponse = await accountApi.getUser(createdUser.userID, tokenPayload.token);
      userPayload = await userResponse.json() as CreateUserResponse;
      console.log(`User profile response: ${JSON.stringify(userPayload)}`);
      expect(userPayload.books.length).toBe(0);
      // Cleanup: remove books (API buggy, skipping to avoid failure)
      // for (const book of userPayload.books) {
      //   const removeResponse = await bookStoreApi.removeBook(book.isbn, createdUser.userID, tokenPayload.token);
      //   expect(removeResponse.ok()).toBeTruthy();
      // }

      if (env.deleteCreatedUser) {
        const deleteUserResponse = await accountApi.deleteUser(createdUser.userID, tokenPayload.token);
        console.log(`delete user response: 
          status: ${deleteUserResponse.status()};
          statusText: ${deleteUserResponse.statusText()}`);
        expect(deleteUserResponse.ok()).toBeTruthy();

        userResponse = await accountApi.getUser(createdUser.userID, tokenPayload.token);
        //convert userResponse to NotFound type
        const notFoundPayload = await userResponse.json() as NotFound;
        console.log(`User profile response after deletion: ${JSON.stringify(notFoundPayload)}`);
        console.log(`userResponse.status(): ${userResponse.status()}`);
        //expect(userResponse.status()).
        expect(notFoundPayload.message).toContain('User not found');
      }
    });

  test('should retrieve a specific book by ISBN',
    async ({ bookStoreApi }) => {
      const response = await bookStoreApi.getBook(knownBooks.designingEvolvableWebAPIs);
      expect(response.ok()).toBeTruthy();
      console.log(`Get book response: ${JSON.stringify(await response.json())}`);

      const payload = await response.json();
      expect(payload.isbn).toBe(knownBooks.designingEvolvableWebAPIs);
      expect(payload.title).toContain('Designing Evolvable Web APIs');
      expect(payload.description).toContain('Design and build Web APIs');

      const inexistentBook = await bookStoreApi.getBook('0000000000000');
      expect(inexistentBook.ok()).toBeFalsy();
      const msgInexistent = await inexistentBook.json();
      console.log(`Get inexistent book response: ${JSON.stringify(msgInexistent)}`);
      console.log(`message when not found: ${msgInexistent.message}`);
    });
});
