import { test, type Page, type Locator } from "@playwright/test";
/** 
 * @param page 
 * @param screenShotName 
 * Take a screenshot of full page
*/
async function takeFullPageScreenshot(page: Page, screenShotName: string) {
    const screenshot = await page.screenshot({ fullPage: true });
    //attach it to the report
    await test.info().attach(screenShotName, {
        body: screenshot,
        contentType: "image/png",
    });
}
/**
 * Element screenshot
 * @param page 
 * @param screenShotName 
 */

async function takeElementScreenshot(element: Locator, screenShotName: string) {
    //take screenshot of element
    const screenshot = await element.screenshot();
    //attach it to the report
    await test.info().attach(screenShotName, {
        body: screenshot,
        contentType: "image/png",
    });
}

export default {takeFullPageScreenshot, takeElementScreenshot};