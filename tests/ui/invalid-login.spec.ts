import { test, expect } from '@fixtures/testFixtures';
import InvalidUser from '@core/constants/invalid-user';
import fileHelper from 'tests/helpers/file-helper';
import path from 'path';
import { log } from 'tests/helpers/logger';
import screenshotHelper from 'tests/helpers/screenshot';
/**
 * 
 * to be run only with config file :
 * npx playwright test --config=configUdemy/test.playwright.config.ts tests/ui/invalid-login.spec.ts --headed
 * after commenting line 4 and uncomment line 5 from playwright.config.ts
 */

//when data is provided by static method in class
//const invUser = InvalidUser.provideInvalidUser();

//when data is provided in csv file
// const csvPath = path.resolve(`${process.cwd()}/src/core/constants/invalid-user.csv`);
// const invUser = fileHelper.readCSV(csvPath);

//when data is provided in xlsx file
const xlsxPath = path.resolve(`${process.cwd()}/src/core/constants/invalid-user.xlsx`);
const invUser = fileHelper.readXLSX(xlsxPath);

for (const user of invUser) {
  test.describe('Login and profile UI',
    { annotation: { type: "Story", description: "JIRA-1234" } }, () => {
      test.beforeEach('go to login page', async () => {
        console.log("====== Start test");
      });

      test(`${user.testId} should prevent login with incorrect creds`,
        { tag: "@withParam" },
        async ({ loginPage, page, browserName }, testInfo) => {
          
          //get the variables from custom config file
          const envConfig = testInfo.project.use as any;
          log("info", `This test is running on ${envConfig.envName} env`)

          //skip the test for firefox
          test.skip(browserName === 'firefox', "open bug for firefox");

          //to get the configuration used by test at runtime
          //console.log(`Config at runtime: ${JSON.stringify(testInfo.config)}`);
          expect(testInfo.title).toBe(`${user.testId} should prevent login with incorrect creds`);
          //await loginPage.goto();
          
          //use url defined in custom config
          log("warn", `URL accessed in test: ${envConfig.appURL}`)
          await page.goto(envConfig.appURL);

          await loginPage.login(user.userName, user.password);

          await loginPage.invalidLoginResult();
          await screenshotHelper.takeFullPageScreenshot(page, 'screenshoot.png');

          // let screenShot = await page.screenshot({ path: testInfo.outputPath('screenshoot.png') });
          // await testInfo.attach('login page', {
          //   body: screenShot,
          //   contentType: "image/png",
          // })
          log("error", `Provided configuration for DB is ${envConfig.dbConfig.server} for server`);
        });
    });
}



