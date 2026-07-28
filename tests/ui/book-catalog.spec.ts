import { test, expect } from '@fixtures/testFixtures';
import { BooksPage } from '@pages/booksPage';
import { BookDetailsPage } from '@pages/bookDetailsPage';
import { expectGroupToContain } from '@core/utils/assertions';

test.describe('Book catalog UI', () => {
  test('should load the catalog, allow search and render searched items',
    async ({ page }) => {
      const booksPage = new BooksPage(page);

      await booksPage.goto();
      await booksPage.expectLoaded();
      await booksPage.searchFor('java');
      //await page.pause();

      const titles = await booksPage.getVisibleBookTitles();
      // console.log('titles: ', titles.forEach(title => {
      //   console.log(title);
      //   expect(title.toLowerCase()).toContain('java');
      // }));
      //validate that all titles filtered contain the searched string
      expectGroupToContain(titles, 'java');

      expect(titles.length).toBeGreaterThan(0);
      console.log('All authors from page:');
      const authors = await booksPage.getVisibleBookAuthors();

      //search on books page actually returns all the records that contain in at least one of the columns the searched string
      console.log('Validate string exist in each row displayed in any of the columns displayed on page:')
      expect(booksPage.searchItem("java")).toBeTruthy();
    });

  test('should open book details page from the catalog and navigate back to it',
    async ({ page }) => {
      const booksPage = new BooksPage(page);
      const detailsPage = new BookDetailsPage(page);

      await booksPage.goto();
      await booksPage.openBookByTitle('Git Pocket Guide');

      await detailsPage.expectTitle('Git Pocket Guide');

      await detailsPage.goToBookstore();
      await booksPage.expectLoaded();
    });
});
