import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    
})


test.describe('suite1', () => {
    test.beforeEach(async ({ page }) =>
        await page.getByText('Forms').click())


    test('the first test', async ({ page }) => {
        await page.getByText('Form Layouts').click()
    })

    test('the second test', async ({ page }) => {
        await page.getByText('Datepicker').click()
    })
})


test('Locator syntax rules', async({page}) => {
    //by Tag name 
    await page.locator('input').first().click()

    //by ID
    page.locator('#inputEmail1')

    //by Class name
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //combine different selection
    page.locator('input[placeholder="Email"][nbinput]')

    //by Xpath
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', {name: "Email" }).first().fill('Hello world');
    await page.getByRole('button', {name: "SUBMIT"}).first().click();
    // await page.getByRole('button', {name: "SIgn in"}).first();
})

test('Reusing locators', async ({page}) => {
    const basicForm =  page.locator('nb-card').filter({hasText: "Basic form"});
    const emailField = basicForm.getByRole('textbox', {name: "Email"});

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();
})

test('extracting values @regression', async ({page}) => {
    const basicForm =  page.locator('nb-card').filter({hasText: "Basic form"});
    const buttonText = await basicForm.locator('button').textContent();
    expect(buttonText).toEqual('Submit');

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
    expect(allRadioButtonsLabels).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"});
    await emailField.fill('test@test.com');
    const email = await emailField.inputValue();
    expect(email).toEqual('test@test.com');

    const placeHolderValue = await emailField.getAttribute('placeholder');
    expect(placeHolderValue).toEqual('Email');
})

test('assertions @smoke', async ({page}) => {
    const basicFormButton =  page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');
    //General assertions
    const value = 5
    expect(value).toEqual(5);

    const text = await basicFormButton.textContent();
    expect(text).toEqual('Submit')

    //Locator assertion
    await expect(basicFormButton).toHaveText('Submit');

    //Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit');
    await basicFormButton.click();
})
