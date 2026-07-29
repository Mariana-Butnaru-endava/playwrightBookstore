import { expect, Locator, Page } from '@playwright/test';
import { env } from '@config/env';

export class ProfilePage {
  readonly usernameValue: Locator;
  //readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.usernameValue = page.locator('#userName-value');
    //this.rows = page.locator('.rt-tbody .rt-tr-group');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${env.baseUrl}${env.profilePath}`);
    await expect(this.page).toHaveURL(/\/profile/);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.page, 'Expect profile page to be loaded').toHaveURL(new RegExp(`${env.profilePath}$`));
    await expect(this.page.getByText('Profile')).toBeVisible();
  }

  async clickOnLoginLink(): Promise<void> {
    await this.page.getByRole('link', { name: 'login', exact: true }).click();
  }

  async expectUsername(userName: string): Promise<void> {
    await expect(this.usernameValue).toHaveText(userName);
  }

  async expectTableVisible(): Promise<void> {
    await expect(this.page.getByRole('columnheader', { name: 'Image' })).toBeVisible();
  }

  async expectBookInAccount(bookTitle: string, bookAuthor: string, bookPublisher: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: bookTitle })).toBeVisible();
    await expect(this.page.getByText(bookAuthor).first()).toBeVisible();
    await expect(this.page.getByText(bookPublisher).first()).toBeVisible();
    //getByRole('link', { name: 'Git Pocket Guide' })
  }

  async expectLogoutVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Logout' })).toBeVisible();
  }

  async goToBookstore(): Promise<void> {
    await this.page.getByRole('button', { name: 'Go To Book Store' }).click();
    await expect(this.page).toHaveURL(/\/books/);
  }

  async deleteBookByTitle(bookTitle: string): Promise<string> {
    await this.page
      .locator('tr', { has: this.page.getByText(bookTitle) })
      .locator('[id^="delete-record"]')
      .click();

    await expect(this.page.getByLabel('Delete Book'))
      .toContainText('Do you want to delete this book?');

    const [dialog] = await Promise.all([
      this.page.waitForEvent('dialog').catch(() => null),
      this.page.getByRole('button', { name: 'OK', exact: true }).click()
    ]);

    if (!dialog) {
      return 'unknown';
    }

    const message = dialog.message();
    console.log(`Dialog message: ${message}`);
    await dialog.dismiss().catch(() => { });
    return message;
  }

  async deleteAllBooks(): Promise<void> {
    if (await this.page.getByRole('button', { name: 'Delete All Books' }).isVisible().catch(() => false)) {
      await this.page.getByRole('button', { name: 'Delete All Books' }).click();

      await expect(this.page.getByLabel('Delete All Books'))
        .toContainText('Do you want to delete all books?');

      await this.page.getByRole('button', { name: 'OK', exact: true }).click().catch(() => { });
    }

    const closeButton = this.page.getByRole('button', { name: 'Close' });

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click().catch(() => { });
    }

    await this.page.reload().catch(() => { });
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
  }

  async getBooksFromAccount(): Promise<string[]> {
    try {
      await Promise.any([
        this.page.waitForSelector('[id^="see-book-"]', { timeout: 10000 }).catch(() => null),
        this.page.waitForSelector('.rt-noData', { timeout: 10000 }).catch(() => null),
      ]);
    } catch {
      // ignore transient waits
    }

    if (this.page.isClosed()) {
      return [];
    }

    const cells = this.page.locator('[id^="see-book-"]');
    const count = await cells.count().catch(() => 0);
    if (count === 0) {
      console.log('get books in account: []');
      return [];
    }

    const texts = await cells.allTextContents().catch(() => []);
    console.log('get books in account:', texts);
    return texts.map((value) => value.trim()).filter(Boolean);
  }

  async logout(): Promise<void> {
    if (await this.page.getByRole('button', { name: 'Logout' }).isVisible().catch(() => false)) {
      await this.page.getByRole('button', { name: 'Logout' }).click();
    }
    await expect(this.page).toHaveURL(/\/login/).catch(() => { });
  }

  async deleteAccount(): Promise<void> {
    const deleteButton = this.page.getByRole('button', { name: 'Delete Account' });
    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click();
    }

    const dialog = await this.page.waitForEvent('dialog', { timeout: 5000 }).catch(() => null);
    if (dialog) {
      const message = dialog.message();
      console.log(`Dialog message: ${message}`);
      await dialog.dismiss().catch(() => { });
    }

    const closeButton = this.page.getByRole('button', { name: 'Close' });
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click().catch(() => { });
    }

    await this.page.reload().catch(() => { });
    await this.page.waitForLoadState('domcontentloaded').catch(() => { });
    //expect(this.page.getByText('User not found!')).toBeVisible();
  }
}
