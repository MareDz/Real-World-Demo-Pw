import { BrowserContext, Page, test } from '@playwright/test'
import { Base } from '../pages/Base'
import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'
import { createUserData, UserData } from '../state/UserModel'

let context: BrowserContext
let page: Page
let ctx: UserData
let loginPage: LoginPage
let registrationPage: RegistrationPage 

// test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
    Base.initializeEnvironmentCRWA()
})
 
test.beforeEach(async ({browser}) => {
    context = await browser.newContext()
    page = await context.newPage()
    ctx = createUserData()
    loginPage = new LoginPage(page, ctx)
    registrationPage = new RegistrationPage(page, ctx)
})

test.afterEach(async () => {
    await context.close()
    await page.close()
})

test("Register New User - Empty Required Fields Validation", async () => {
    await loginPage.launchRWA()
    await loginPage.goToRegistrationPage()
    await registrationPage.verifyRegistrationFormEmptyFieldErrorHandling()
    ctx.bank.accountNumber =  "123123"
    console.log("TEST 1 Bank account number is " + ctx.bank.accountNumber)
})

test("Register New User - Password Fields Validations", async () => {
    await loginPage.launchRWA()
    await loginPage.goToRegistrationPage()
    await registrationPage.verifyRegistrationFormPasswordFieldsErrorHandling()
    console.log("TEST 2 Bank account number is " + ctx.bank.accountNumber)

})