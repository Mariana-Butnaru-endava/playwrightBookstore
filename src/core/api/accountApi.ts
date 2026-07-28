import { expect, APIResponse } from '@playwright/test';
import { ApiClient } from './apiClient';
import { env } from '@config/env';

export interface AccountCredentials {
  userName: string;
  password: string;
}

export interface CreateUserResponse {
  userID: string;
  username: string;
  books: Array<{ isbn: string }>;
}

export interface NotFound {
  code: string;
  message: string;
}

export class AccountApi {
  constructor(private readonly client: ApiClient) {}

  async createUser(credentials: AccountCredentials): Promise<CreateUserResponse> {
    const response = await this.client.post(`${env.accountBasePath}/User`, {
      data: credentials
    });

    await expect(response, 'Create user should return 201 Created').toBeOK();
    return response.json();
  }

  async generateToken(credentials: AccountCredentials): Promise<{ token: string; expires: string; status: string; result: string }> {
    const response = await this.client.post(`${env.accountBasePath}/GenerateToken`, {
      data: credentials
    });

    await expect(response, 'Generate token should return 200 OK').toBeOK();
    return response.json();
  }

  async authorize(credentials: AccountCredentials): Promise<APIResponse> {
    return this.client.post(`${env.accountBasePath}/Authorized`, {
      data: credentials
    });
  }

  async getUser(userId: string, token?: string): Promise<APIResponse> {
    const response = await this.client.get(`${env.accountBasePath}/User/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });

    // if (response.status() === 401) {
    //   return await response.json();
    // }

    return response;
  }

  async deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.client.delete(`${env.accountBasePath}/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
