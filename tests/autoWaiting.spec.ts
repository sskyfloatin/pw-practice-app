import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto-waiting', async ({page}) => {
    const successButton = page.locator('.bg-success');

    await successButton.click();
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000});
})

test('alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success');


    //wait for element 
    // await page.waitForSelector('.bg-success');

    //wait for particular response 
    // await page.waitForResponse('https://uitestingplayground.com/ajaxdata')

    //wait fot network calls (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle');

    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.');
})

test('timeouts', async ({page}) => {
    // test.setTimeout(16000)
    test.slow()
    const successButton = page.locator('.bg-success');
    await successButton.click()
})