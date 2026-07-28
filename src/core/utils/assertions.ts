import { expect, Locator } from '@playwright/test';

export async function expectTextsToContain(locator: Locator, expectedValue: string): Promise<void> {
  const texts = await locator.allTextContents();
  for (const text of texts) {
    expect.soft(text.toLowerCase()).toContain(expectedValue.toLowerCase());
  }
}

export async function expectGroupToContain(group: Array<string>, expectedValue: string): Promise<void> {
  console.log('titles: ', group.forEach(title => {
    console.log('title: ', title);
    expect(title.toLowerCase()).toContain(expectedValue.toLowerCase());
  }));
}

export function expectBookIsPresent(books: Array<{ isbn: string }>, isbn: string): void {
  expect(books.some((book) => book.isbn === isbn)).toBeTruthy();
}
