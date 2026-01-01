import {test as base} from '@playwright/test'
import { PageManager } from '../pw-practice-app/page-objects/pageManager'

export type TestOptions = {
    globalsQAURL: string
    formsLayoutPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQAURL: ['', {option: true}], 

    formsLayoutPage: [async({page}, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layout').click()
        await use('')
    }, {auto: true}], 

    pageManager: async({page}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
})