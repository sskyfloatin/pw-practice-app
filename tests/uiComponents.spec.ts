import { expect, test } from '@playwright/test'
test.describe.configure({mode: 'parallel'})

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Form layouts page', () => {
    //override retries in playwright config
    test.describe.configure({retries: 1})
    test.describe.configure({mode: 'serial'})
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'});
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 300})

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //locator assertion 
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    })

    test('radio buttons', async({page}) => {
        // const radioButton = page.locator('nb-card', {hasText: 'Using the Grid'}).getByLabel('Option 1');
        const radioButton = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('radio', {name: 'Option 1'});
        await radioButton.check({force: true})
        const isChecked = await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('radio', {name: 'Option 1'}).isChecked();
        const isNotChecked = await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('radio', {name: 'Option 2'}).isChecked();
        expect(isChecked).toBeTruthy()
        expect(isNotChecked).toBeFalsy()
        await expect(radioButton).toBeChecked();

    })
})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    await page.getByRole('checkbox', {name: 'Hide on click'}).check({force: true})
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).uncheck({force: true})

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('Lists and Dropdowns', async({page}) => {
    const dropDown = page.locator('ngx-header nb-select')
    await dropDown.click()
    
    // const optionList = page.getByRole('list').locator('nb-option-list')
    const optionList = page.locator('nb-option-list nb-option')
    // await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])

    // await optionList.filter({hasText: 'Cosmic'}).click()

    const header = page.locator('nb-layout-header')

    //click dropdown list and verify background clour change, one by one approach
    // await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    // await dropDown.click()
    // await optionList.filter({hasText: 'Dark'}).click()
    // await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)')

    // await dropDown.click()
    // await optionList.filter({hasText: 'Corporate'}).click()
    // await expect(header).toHaveCSS('background-color', 'rgb(255, 255, 255)')

    //click dropdown list and verify background color change, for in loop approach
    const colors = {
        'Light': 'rgb(255, 255, 255)',
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    // await expect(optionList).toHaveCount(4)

    for(const color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != 'Corporate') {
            await dropDown.click()
        }
    }
})

test('Tooltip', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    await page.getByRole('button').getByText('Show Tooltip').first().hover()

    const toolTip = await page.locator('nb-tooltip').textContent()
    expect (toolTip).toEqual('This is a tooltip')
})

test('Dialog', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()
    
    const expectedName = 'Nguyen'
    await page.locator('nb-card').getByRole('button').getByText('Enter name').click()
    await page.locator('ngx-dialog-name-prompt input').fill(expectedName)
    await page.getByRole('button').getByText('Submit').click()

    const actualName = await page.locator('nb-card-body ul li').textContent()
    expect(actualName).toEqual(expectedName)

    // const toolTip = await page.locator('nb-tooltip').textContent()
    // expect (toolTip).toEqual('This is a tooltip')
})

test('Accept dialog', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //listener to accept popup dialog
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    const email = 'mdo@gmail.com'
    await page.getByRole('table').locator('tr', {hasText: email}).locator('.nb-trash').click()

    await expect(page.locator('table tr').first()).not.toHaveText(email)
})

test('Delete all rows from table', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //listener to accept popup dialog
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    const trashList = page.locator('nb-trash')
    await page.waitForSelector('.nb-trash')
    while(await page.locator('.nb-trash').first().isVisible()) {
        await page.getByRole('table').locator('.nb-trash').first().click()
    }
    
})

test('Web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //get a row by any text in the row and edit
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()

    const expectedAge = '35'
    
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill(expectedAge)
    await page.locator('.ng2-smart-action-edit-save').click()

    expect(await targetRow.locator('td').last().locator('.ng-star-inserted').first().textContent()).toEqual(expectedAge)

    //get a row by specific value in the row using filter 
    await page.locator('.ng2-smart-page-item').getByText('2').click()
    const tableRowById = await page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await tableRowById.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('1@1.com')
    await page.locator('.ng2-smart-action-edit-save').click()
    await expect(tableRowById.locator('td').nth(5)).toHaveText('1@1.com')

    //filter table by a row
    const ages = ['20', '30', '40', '200']
    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const filteredRows = await page.locator('tbody tr')

        //loop inside a loop to iterate through filtered columns and verify cell values are filtered
        for(let row of await filteredRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            if(age == '200') {
                age = ' No data found '
            }
            expect(cellValue).toEqual(age)
        }
    }

})

test('Datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = await page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    
    let date = new Date()
    date.setDate(date.getDate() + 300)
    const expectedDay = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-Us', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-Us', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`
    let currentCalendarMonthAndYear = await page.locator('nb-calendar-view-mode button').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
    //iterate through month picker to select correct month after incrementing date 
    while(expectedMonthAndYear != currentCalendarMonthAndYear) {
        await page.locator('nb-calendar-pageable-navigation button').last().click()
        currentCalendarMonthAndYear = await page.locator('nb-calendar-view-mode button').textContent()
    }

    //specify exact value getByText('1', {exact: true})
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDay, {exact: true}).click()
    await expect (calendarInputField).toHaveValue(dateToAssert)
})

test('Sliders', async({page}) => {
    //update attribute of dragger/circle 
    const circle = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await circle.evaluate(node => {
        node.setAttribute('cx', '37.128')
        node.setAttribute('cy', '60.578')
    })
    await circle.click()

    //move the dragger
    const circleBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await circleBox.scrollIntoViewIfNeeded()
    const box = await circleBox.boundingBox()

    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up() 
    await expect(circleBox).toContainText('30') 
})
