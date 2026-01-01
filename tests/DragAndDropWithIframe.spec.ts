import { expect } from '@playwright/test'
import {test} from '../test-options'

test('drag and drop with iFrame', async ({page, globalsQAURL}) => {
    await page.goto(globalsQAURL)
    const iFrame = await page.frameLocator("[rel-title='Photo Manager'] iframe")
    await iFrame.locator('li', {hasText: 'High Tatras 2'}).dragTo(iFrame.locator('#trash'))
    
    //more precise control 
    await iFrame.locator('li', {hasText: 'High Tatras 4'}).hover()
    await page.mouse.down()
    await iFrame.locator('#trash').hover()
    await page.mouse.up()

    await expect(iFrame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4'])
})