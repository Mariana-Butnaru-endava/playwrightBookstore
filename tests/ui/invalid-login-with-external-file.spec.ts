import { test, expect } from '@fixtures/testFixtures';
import InvalidUser, { LoginUserRow } from '@core/constants/invalid-user';
import fileHelper from 'tests/helpers/file-helper';
import path from 'path';
import { log } from 'tests/helpers/logger';
import screenshotHelper from 'tests/helpers/screenshot';

// required columns every data source must provide - catches a missing/typo'd
// header in the csv/xlsx file at load time instead of failing later with
// `undefined` inside a test
const requiredKeys: (keyof LoginUserRow)[] = ["testId", "userName", "password", "expectedMsg"];

//when data is provided by static method in class
//const invUser = InvalidUser.provideInvalidUser();

//when data is provided in csv file
// const csvPath = path.resolve(`${process.cwd()}/src/core/constants/invalid-user.csv`);
// const invUser = fileHelper.readCSV<LoginUserRow>(csvPath, requiredKeys);

//when data is provided in xlsx file
const xlsxPath = path.resolve(`${process.cwd()}/src/core/constants/invalid-user.xlsx`);
const invUser = fileHelper.readXLSX<LoginUserRow>(xlsxPath, undefined, requiredKeys);

  test.describe('Login and profile UI',
    { annotation: { type: "Story", description: "JIRA-1234" } }, () => {
      
      test.beforeEach('go to login page', async () => {
        console.log("====== Start test");
      });

      for (const user of invUser) {
      test(`${user.testId} should prevent login with incorrect creds`,
        { tag: "@withExternalFile" },
        async ({ loginPage, page }, testInfo) => {
          //to get the configuration used by test at runtime
          //console.log(`Config at runtime: ${JSON.stringify(testInfo.config)}`);
          expect(testInfo.title).toBe(`${user.testId} should prevent login with incorrect creds`);
          
          await loginPage.goto();
          await loginPage.login(user.userName, user.password);

          await loginPage.invalidLoginResult(user.expectedMsg);
          await screenshotHelper.takeFullPageScreenshot(page, 'screenshoot.png');
        });
    }
});



