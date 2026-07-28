import { expect, Locator, Page } from '@playwright/test';
import { env } from '@config/env';

export class BooksPage {
  readonly searchBox: Locator;
  //readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.searchBox = page.locator('#searchBox');
    //this.rows = page.locator('#root div').filter({ hasText: 'LoginImageTitleAuthorPublisher' }).nth(3);
    //locator('.rt-tbody .rt-tr-group');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${env.baseUrl}${env.booksPath}`);
    await expect(this.page).toHaveURL(/\/books/);
  }

  async searchFor(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }

  async openBookByTitle(title: string): Promise<void> {
    await this.page.getByRole('link', { name: title }).click();
  }

  async getVisibleBookTitles(): Promise<string[]> {
    const cells = this.page.locator('[id^="see-book-"]');
    const texts = await cells.allTextContents();
    return texts.map((value) => value.trim()).filter(Boolean);
  }

  async getVisibleBookAuthors(): Promise<string[]> {
    const cells = this.page.locator('tbody tr td:nth-child(3)');
    console.log(await cells.count());
    const texts = await cells.allTextContents();
    for (const author of texts) {
      console.log('author: ', author);
    }
    return texts.map((value) => value.trim()).filter(Boolean);
  }

  async searchItem(searchedItem: string): Promise<boolean> {
    const term = searchedItem.toLowerCase();
    const cells = this.page.locator('tbody tr td');
    const texts: string[] = (await cells.allTextContents())
      .map((value) => value.trim()).filter(Boolean);

    texts.forEach(text => console.log(text));

    for (let i = 0; i < texts.length; i += 3) {

      const group = texts.slice(i, i + 3);

      // If the last group is incomplete, you can choose to ignore it
      // or return false. Here we ignore incomplete groups.
      // if (group.length < 3) {
      //   break;
      // }

      const found = group.some(item =>
        item.toLowerCase().includes(term)
      );

      if (!found) {
        return false;
      }
    }
    return true;
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByText('Book Store Application')).toBeVisible();
    await expect(this.searchBox).toBeVisible();
    //await expect(this.rows.first()).toBeVisible();
  }

  async addBookToAccount(title: string):
    Promise<{ status: 'added' | 'alreadyPresent' | 'unknown'; message: string }> {
    await this.page.getByRole('link', { name: title }).click();
    await expect(this.page.getByRole('button', { name: 'Add To Your Collection' })).toBeVisible();

    const [dialog] = await Promise.all([
      this.page.waitForEvent('dialog'),
      this.page.getByRole('button', { name: 'Add To Your Collection' }).click(),
    ]);

    const message = dialog.message();
    console.log(`Dialog message: ${message}`);

    const normalized = message.toLowerCase();
    const status = normalized.includes('already present')
      ? 'alreadyPresent'
      : normalized.includes('book added')
        ? 'added'
        : 'unknown';

    await dialog.accept();

    //await this.page.waitForLoadState('networkidle');
    if (!this.page.url().endsWith(env.profilePath)) {
      await this.page.goto(`${env.baseUrl}${env.profilePath}`);
    }
    await expect(this.page).toHaveURL(new RegExp(`${env.profilePath}$`));

    await Promise.race([
      this.page.waitForSelector('[id^="see-book-"]', { timeout: 5000 }),
      this.page.waitForSelector('.rt-noData', { timeout: 5000 }),
    ]);

    return { status, message };
  }
}
