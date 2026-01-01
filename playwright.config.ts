import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions>({
  expect: {
    timeout: 2000
  },
  globalTimeout: 60000,
  timeout: 30000,
  fullyParallel: true,  

  retries: 1,
  
  reporter: [
            //  ['json', {outputFile: 'test-results/jsonReport.json'}],
            //  ['junit', {outputFile: 'test-results/junitReport.xml'}],
            //  ['allure-playwright']
            ['html']
          ],
  
  use: {
    globalsQAURL: 'https://www.globalsqa.com/demo-site/draganddrop/',

    baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
    : process.env.STAGING === '1' ? 'http://localhost:4201/'
    : 'http://localhost:4200/', 

    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    actionTimeout: 5000,
    navigationTimeout: 10000,
    video: {
      mode: 'off',
      size: {width: 480, height: 480}
    }
  },

  projects: [
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox'
      }
    },
    {
      name: 'mobile',
      testMatch:'testMobile.spec.ts',
      use: {
        ...devices['iPhone 14 Pro'],
        // viewport: {width: 414, height: 800}
      }
    },
  ],
});
