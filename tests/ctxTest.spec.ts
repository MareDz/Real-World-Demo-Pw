import { BrowserContext, Page, test } from '@playwright/test'
import { createUserData, UserData } from '../state/UserModel'
import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'

let context: BrowserContext
let page: Page
let ctx: UserData
let loginPage: LoginPage
let registrationPage: RegistrationPage

test.beforeAll(async () => {
  console.log('Before All')
})

test.beforeEach(async ({ browser }) => {
  console.log('Before Each')

  context = await browser.newContext()
  page = await context.newPage()

  ctx = createUserData()
})

test('Register New User - Empty Required Fields Validation', async () => {
  ctx.bank.accountNumber = '123123'
  console.log('TEST 1 Bank account number is ' + ctx.bank.accountNumber)
})

test('Register New User - Password Fields Validations', async () => {
  console.log('TEST 2 Bank account number is ' + ctx.bank.accountNumber)
})
