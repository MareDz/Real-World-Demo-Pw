import test, { BrowserContext, Page } from '@playwright/test'
import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_registerUser } from '../utils/apiHelpers'
import { getAccountNumber, getBankName, getRoutingNumber } from '../utils/fnHelpers'
import { createUserData, UserData } from '../state/UserModel'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { SideNavPage } from '../pages/SideNavPage'
import { TransactionPage } from '../pages/TransactionPage'

let ctxA: UserData
let ctxB: UserData
let loginPage: LoginPage
let onboardingPage: OnboardingPage
let sideNavPage: SideNavPage
let transactionPage: TransactionPage

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ page }) => {
  ctxA = createUserData()
  ctxB = createUserData()

  loginPage = new LoginPage(page, ctxA)
  onboardingPage = new OnboardingPage(page, ctxA)
  sideNavPage = new SideNavPage(page, ctxA)
  transactionPage = new TransactionPage(page, ctxA)

  await loginPage.launchRWA()
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test('New Transaction - Empty Fields Validation', async ({ request, page }) => {
  // Generate user 1
  await GET_getNewUserData(ctxA)
  await POST_registerUser(request, ctxA)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.logout()
  let user1Username = String(ctxA.user.username)
  let user1FirstName = String(ctxA.user.firstName)
  let user1LastName = String(ctxA.user.lastName)

  // Generate user 2
  await loginPage.launchRWA()
  await GET_getNewUserData(ctxA)
  await POST_registerUser(request, ctxA)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await transactionPage.clickCreateNewTransaction()
  
  // Search for user 1
  await transactionPage.searchForUser(user1Username)
  await transactionPage.clickOnUserAndVerifyDetails(user1Username, user1FirstName, user1LastName)
  await transactionPage.verifyActionsAreDisabled()
  await transactionPage.verifyTransactionEmptyFieldsErrorHandling()
})
