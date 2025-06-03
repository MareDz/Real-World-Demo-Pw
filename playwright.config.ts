import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

export default defineConfig({
  testMatch: ['**.spec.ts'],
  fullyParallel: process.env.CI ? !true : !true,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 3 : 4,

  reporter: process.env.CI
    ? [
        ['html', { open: 'never' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
      ]
    : [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  timeout: 50000,
  reportSlowTests: null,
  use: {
    headless: process.env.CI ? true : false,
    actionTimeout: 20000,
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
      name: 'Setup Admin',
      testMatch: 'setupAdmin.ts',
    },
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
      // dependencies: ['Setup Admin'],
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'Webkit',
      use: { browserName: 'webkit' },
    },
  ],
})
