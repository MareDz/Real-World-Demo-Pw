import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

export default defineConfig({
  testMatch: ['**.spec.ts'],
  fullyParallel: process.env.CI ? !true : !true,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 2 : 2,

  reporter: process.env.CI
    ? [
        ['html', { open: 'never' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
      ]
    : [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  timeout: 50000,
  reportSlowTests: null,
  use: {
    headless: process.env.CI ? true : true,
    actionTimeout: 30000,
    video: 'off',
    screenshot: process.env.CI ? 'only-on-failure' : 'only-on-failure',
    viewport: { width: 1600, height: 1000 },
    trace: 'on',
  },
  expect: {
    timeout: 25000,
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
