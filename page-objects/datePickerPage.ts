import { expect, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class DatePickerPage extends BasePage {

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = await this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday)
        await expect (calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDateWithRange(startdDateFromToday: number, endDateFromToday: number) {
        const calendarInputField = await this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const startDateToAssert = await this.selectDateInCalendar(startdDateFromToday)
        const endDateToAssert = await this.selectDateInCalendar(endDateFromToday)
        const dateToAssert = `${startDateToAssert} - ${endDateToAssert}`
        await expect (calendarInputField).toHaveValue(dateToAssert)
    }
    
    private async selectDateInCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDay = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-Us', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-Us', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`
        let currentCalendarMonthAndYear = await this.page.locator('nb-calendar-view-mode button').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
        //iterate through month picker to select correct month after incrementing date 
        while(expectedMonthAndYear != currentCalendarMonthAndYear) {
            await this.page.locator('nb-calendar-pageable-navigation button').last().click()
            currentCalendarMonthAndYear = await this.page.locator('nb-calendar-view-mode button').textContent()
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDay, {exact: true}).click()
        return dateToAssert
    }
}