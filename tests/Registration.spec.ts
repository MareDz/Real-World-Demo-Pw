import { BrowserContext, Page, test } from '@playwright/test'
import { Base } from '../pages/Base'
import { TestContext } from '../state/TestContext'
import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'

let context: BrowserContext
let page: Page
let testContext: TestContext
let loginPage: LoginPage
let registrationPage: RegistrationPage 

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
    Base.initializeEnvironmentCRWA()
})
 
test.beforeEach(async ({browser}) => {
    context = await browser.newContext()
    page = await context.newPage()
    testContext = new TestContext()
    loginPage = new LoginPage(page, testContext)
    registrationPage = new RegistrationPage(page, testContext)
})

test.afterEach(async () => {
    await context.close()
    await page.close()
})

test("Register New User - Empty Required Fields Validation", async () => {
    await loginPage.launchRWA()
    await loginPage.goToRegistrationPage()
    await registrationPage.verifyRegistrationFormEmptyFieldErrorHandling()
})

test("Register New User - Password Fields Validations", async () => {
    await loginPage.launchRWA()
    await loginPage.goToRegistrationPage()
    await registrationPage.verifyRegistrationFormPasswordFieldsErrorHandling()
})