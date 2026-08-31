import { expect, Locator, Page } from '@playwright/test';
import { env } from '@config/env';

export class LoginPage {
  readonly userNameFld: Locator;
  //readonly passwordFld: Locator;
  //readonly loginBtn: Locator;
  constructor(private readonly page: Page) {
    this.userNameFld = page.locator('#userName');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${env.baseUrl}${env.loginPath}`);
    await expect(this.page, 'Successfully navigated to login page').toHaveURL(/\/login/);
  }

  async login(userName: string, password: string): Promise<void> {
    await expect(this.page).toHaveTitle('demosite');
    await expect(this.page.locator('//h1')).toHaveText("Login");

    //await this.page.locator('#userName').fill(userName);
    await this.userNameFld.fill(userName);
    await this.page.locator('#password').fill(password,{timeout:10_000});
    //await expect(this.userNameFld, 'Name field is populated correctly').toHaveText(userName);
    await this.page.locator('#login').click();
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.page, 'Expect login page to be loaded').toHaveURL(new RegExp(`${env.loginPath}$`));
    await expect(this.page.getByText('Login in Book Store')).toBeVisible();
  }

  async invalidLoginResult() {
    await expect(this.page.getByText("Invalid username or password!")).toBeVisible();
    await expect(this.page.locator('#name')).toContainText('Invalid username or password!',{timeout: 5_000});
      
  }
}
