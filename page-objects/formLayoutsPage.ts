import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class FormLayoutsPage extends BasePage {

    constructor(page: Page) {
        super(page)
    }

    async fillAndSubmitUsingTheGrid(email: string, password: string, optionText: string) {
        const usingTheGridEmailInput = this.page.locator('nb-card', {hasText: 'Using the Grid'})
        await usingTheGridEmailInput.getByRole('textbox', {name: 'Email'}).fill(email);
        await usingTheGridEmailInput.getByRole('textbox', {name: 'Password'}).fill(password);
        usingTheGridEmailInput.getByRole('radio', {name: optionText}).check({force: true});
        await usingTheGridEmailInput.getByRole('button').click()
    }

    async fillAndSubmitInlineForm(name: string, email: string, rememberMe: boolean) {
        const inlineForm = this.page.locator('nb-card', {hasText: 'Inline form'})
        await inlineForm.getByRole('textbox', {name: 'Jane Doe'}).fill(name);
        await inlineForm.getByRole('textbox', {name: 'Email'}).fill(email);
        if(rememberMe) {
            inlineForm.getByRole('checkbox').check({force: true});
        }
        await inlineForm.getByRole('button').click()
    }
}
