import { expect, Locator, Page } from '@playwright/test';

export class BookDetailsPage {
  readonly titleValue: Locator;
  readonly backToBookstore: Locator;

  constructor(private readonly page: Page) {
    this.titleValue = page.locator('#title-wrapper #userName-value');
    this.backToBookstore = page.getByRole('button', { name: 'Back To Book Store' });
  }

  async expectTitle(title: string): Promise<void> {
    await expect(this.titleValue).toHaveText(title);
  }

  async goToBookstore(): Promise<void> {
    this.backToBookstore.click();
  }
}
