import { expect, APIResponse } from '@playwright/test';
import { ApiClient } from './apiClient';
import { env } from '@config/env';

export interface Book {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date:string;
  publisher: string;
  pages:number;
  description:string;
  website: string;
}

export class BookStoreApi {
  constructor(private readonly client: ApiClient) {}

  async getBooks(): Promise<{ books: Book[] }> {
    const response = await this.client.get(`${env.bookstoreBasePath}/Books`);
    await expect(response, 'Get books should return 200 OK').toBeOK();
    return response.json();
  }

  async getBook(isbn: string): Promise<APIResponse> {
    return this.client.get(`${env.bookstoreBasePath}/Book`, {
      params: { ISBN: isbn }
    });
  }

  async addBooks(userId: string, isbns: string[], token: string): Promise<APIResponse> {
    return this.client.post(`${env.bookstoreBasePath}/Books`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn }))
      }
    });
  }

  async removeBook(isbn: string, userId: string, token: string): Promise<APIResponse> {
    return this.client.delete(`${env.bookstoreBasePath}/Book`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { isbn, userId }
    });
  }

  async removeAllBooks(userId: string, token: string): Promise<APIResponse> {
    return this.client.delete(`${env.bookstoreBasePath}/Books`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { UserId: userId }
    });
  }

  async replaceBook(userId: string, ISBN: string, isbn: string, token: string): Promise<APIResponse> {
    const url = `${env.bookstoreBasePath}/Books/${ISBN}`;
    const requestHeaders = {
      Authorization: `Bearer ${token}`
    };
    const requestBody = {
      userId,
      isbn
    };

    console.log('[replaceBook] request', {
      url,
      headers: requestHeaders,
      body: requestBody
    });

    const response = await this.client.put(url, {
      headers: requestHeaders,
      data: requestBody
    });

    console.log('[replaceBook] response', {
      status: response.status(),
      headers: response.headers(),
      body: await response.text()
    });

    return response;
  }
}
