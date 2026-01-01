import { test } from '../test-options'
import {faker} from '@faker-js/faker'


test('parametrized methods', async ({pageManager}) => {    
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(100)}@test.com`

    await pageManager.onFormLayoutsPage().fillAndSubmitUsingTheGrid(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    await pageManager.onFormLayoutsPage().fillAndSubmitInlineForm(randomFullName, randomEmail, true)
})