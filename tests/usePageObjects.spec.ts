import { test } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

// test('navigate to form page', async ({page}) => {
//     const pm = new PageManager(page)
//     await pm.navigateTo().openFormLayoutsPage()
//     await pm.navigateTo().openDatePickerPage()
//     await pm.navigateTo().openSmartTablePage()
//     await pm.navigateTo().openToastrPage()
//     await pm.navigateTo().openTooltipPage()
// })

test('parametrized methods', async ({page}) => {    
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(100)}@test.com`
    const pm = new PageManager(page)
    await pm.navigateTo().openFormLayoutsPage()
    await pm.onFormLayoutsPage().fillAndSubmitUsingTheGrid(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    await page.screenshot({path: 'screenshots/formsLayoutPage.png'})

    await pm.onFormLayoutsPage().fillAndSubmitInlineForm(randomFullName, randomEmail, true)

    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/InlineForm.png'})


    // await pm.navigateTo().openDatePickerPage()
    // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(30)
    // await pm.onDatePickerPage().selectDateWithRange(5, 10)
})