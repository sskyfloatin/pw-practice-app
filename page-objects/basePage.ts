import { Page } from "@playwright/test";

export class BasePage {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async waitForNumberOfSeonds(numberOfSeconds: number) {
        await this.page.waitForTimeout(numberOfSeconds * 1000)
    }
}