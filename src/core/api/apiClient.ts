import { APIRequestContext, APIResponse, request } from '@playwright/test';

export class ApiClient {
  private constructor(private readonly context: APIRequestContext) {}

  static async create(baseURL: string, extraHTTPHeaders?: Record<string, string>): Promise<ApiClient> {
    const context = await request.newContext({
      baseURL,
      extraHTTPHeaders
    });

    return new ApiClient(context);
  }

  async get(url: string, options?: Parameters<APIRequestContext['get']>[1]): Promise<APIResponse> {
    return this.context.get(url, options);
  }

  async post(url: string, options?: Parameters<APIRequestContext['post']>[1]): Promise<APIResponse> {
    return this.context.post(url, options);
  }

  async delete(url: string, options?: Parameters<APIRequestContext['delete']>[1]): Promise<APIResponse> {
    return this.context.delete(url, options);
  }

  async put(url: string, options?: Parameters<APIRequestContext['put']>[1]): Promise<APIResponse> {
    return this.context.put(url, options);
  }

  dispose(): Promise<void> {
    return this.context.dispose();
  }
}
