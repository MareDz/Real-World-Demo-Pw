import { BrowserContext, Page } from '@playwright/test'
import { test } from './fixturesModel'
import { Base } from '../pages/Base'

let context: BrowserContext
let page: Page

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ browser }) => {
  context = await browser.newContext()
  page = await context.newPage()
})

test.afterEach(async () => {
  await page.close()
  await context.close()
})

test('Register New User - Empty Required Fields Validation', async ({ loginPage, registrationPage }) => {
  await loginPage.launchRWA()
  await loginPage.goToRegistrationPage()
  await registrationPage.verifyRegistrationFormEmptyFieldErrorHandling()
})

test('Register New User - Password Fields Validations', async ({ loginPage, registrationPage }) => {
  await loginPage.launchRWA()
  await loginPage.goToRegistrationPage()
  await registrationPage.verifyRegistrationFormPasswordFieldsErrorHandling()
})
