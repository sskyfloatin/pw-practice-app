import { Locator, Page } from "@playwright/test";
import { BasePage as BasePage } from "./basePage";

export class NavigationPage extends BasePage {

    readonly formLayoutMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrItem: Locator
    readonly tooltipItem: Locator


    constructor(page: Page) {
        super(page)
        this.formLayoutMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.toastrItem = page.getByText('Toastr')
        this.tooltipItem = page.getByText('Tooltip')
    }

    async openFormLayoutsPage() {
        // await this.page.getByText('Forms').click()
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutMenuItem.click()
        await this.waitForNumberOfSeonds(3)
    }

    async openDatePickerPage() {
        // await this.page.getByText('Forms').click()
        // await this.page.waitForTimeout(1000)
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenuItem.click()
    }

    async openSmartTablePage() {
        // await this.page.getByText('Tables & Data').click()
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async openToastrPage() {
        // await this.page.getByText('Modal & Overlays').click()
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrItem.click()
    }

    async openTooltipPage() {
        // await this.page.getByText('Modal & Overlays').click()
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const isExpanded = await groupMenuItem.getAttribute('aria-expanded')
        if (isExpanded == 'false') {
            await groupMenuItem.click()
        }
    }
}