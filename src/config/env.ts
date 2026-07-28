import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL', 'https://demoqa.com'),
  booksPath: required('BOOKS_PATH', '/books'),
  loginPath: required('LOGIN_PATH', '/login'),
  profilePath: required('PROFILE_PATH', '/profile'),
  apiBaseUrl: required('API_BASE_URL', 'https://demoqa.com'),
  accountBasePath: required('API_ACCOUNT_BASE_PATH', '/Account/v1'),
  bookstoreBasePath: required('API_BOOKSTORE_BASE_PATH', '/BookStore/v1'),
  defaultPassword: required('DEFAULT_PASSWORD', 'Password123!'),
  deleteCreatedUser: (process.env.DELETE_CREATED_USER ?? 'false').toLowerCase() === 'true'
};
