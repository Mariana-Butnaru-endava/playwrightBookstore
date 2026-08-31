import { test, expect } from '@fixtures/testFixtures';
test.beforeAll("before all hook", () => { });
test.beforeEach("before each hook", () => { });


test.describe('Login and profile UI',
  { annotation: { type: "Story", description: "JIRA-1234" } }, () => {
    test.beforeEach('go to login page', async () => {
      console.log("====== Start test");
    });

    test('should login with a user created through the API',
      async ({ loginPage, profilePage, accountApi, testUser, page }) => {
        const createdUser = await accountApi.createUser(testUser);
        const tokenResponse = await accountApi.generateToken(testUser);
        console.log('Created user:', createdUser.username);
        console.log('Generated token:', tokenResponse.token);

        expect(tokenResponse.token).toBeTruthy();

        await loginPage.goto();

        await loginPage.login(testUser.userName, testUser.password);

        await profilePage.waitForLoaded();
        await profilePage.expectUsername(createdUser.username);

        // get login cookies and save it to env variable declared in global-setup
        const loginCookies = await page.context().cookies();
        process.env.LOGIN_COOKIES = JSON.stringify(loginCookies);

        await profilePage.deleteAccount();
      });

    test("should prevent login with incorrect creds",
      { annotation: { type: "bug", description: "defect 1234" }, tag: "@justme" },
      async ({ loginPage, page, browserName }, testInfo) => {
        //skip the test for firefox
        test.skip(browserName === 'firefox', "open bug for firefox");

        console.log(`Config at runtime: ${JSON.stringify(testInfo.config)}`);
        expect(testInfo.title).toBe('should prevent login with incorrect creds');

        //demonstrate that env variable define in global-setup and assigned in previous test is accessible on a different test
        console.log(`Login cookie: ${process.env.LOGIN_COOKIES}`);

        await loginPage.goto();
        await loginPage.login('InvalidUsername', 'InvalidPassword');

        await loginPage.invalidLoginResult();
        let screenShot = await page.screenshot({ path: testInfo.outputPath('screenshoot.png') });
        await testInfo.attach('login page', {
          body: screenShot,
          contentType: "image/png",
        })
      });
  });
