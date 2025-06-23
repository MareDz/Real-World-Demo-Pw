import test from '@playwright/test'
import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_createBankAccount, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
import { createUserData, UserData } from '../state/UserModel'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { SideNavPage } from '../pages/SideNavPage'
import { TransactionPage } from '../pages/TransactionPage'
import { getBankName, getRoutingNumber, getAccountNumber } from '../utils/fnHelpers'

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

test('New Transaction - Empty Fields Validation - Demo v1', async ({ request }) => {
  // Generate user 1
  await GET_getNewUserData(ctxA)
  await POST_registerUser(request, ctxA)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.logout()

  const { username: user1Username, firstName: user1FirstName, lastName: user1LastName } = ctxA.user

  // Generate user 2
  await loginPage.launchRWA()
  await GET_getNewUserData(ctxA)
  await POST_registerUser(request, ctxA)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await transactionPage.clickCreateNewTransaction()

  // Search for user 1
  await transactionPage.searchForUser(String(user1Username))
  await transactionPage.clickOnUserAndVerifyDetails(String(user1Username), String(user1FirstName), String(user1LastName))
  await transactionPage.verifyActionsAreDisabled()
  await transactionPage.verifyTransactionEmptyFieldsErrorHandling()
})

test('New Transaction - Empty Fields Validation - Demo v2', async ({ request }) => {
  // Create User 1
  await GET_getNewUserData(ctxA)
  await POST_registerUser(request, ctxA)
  // Create User 2
  await GET_getNewUserData(ctxB)
  await POST_registerUser(request, ctxB)

  const { username: user1Username, password: user1password } = ctxA.user
  const { username: user2Username, firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  // Login UI User 1
  await loginPage.login(true, user1Username, user1password)
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await transactionPage.clickCreateNewTransaction()

  // Search for User 2
  await transactionPage.searchForUser(String(user2Username))
  await transactionPage.clickOnUserAndVerifyDetails(String(user2Username), String(user2FirstName), String(user2LastName))

  // Verify Input Error Handling
  await transactionPage.verifyActionsAreDisabled()
  await transactionPage.verifyTransactionEmptyFieldsErrorHandling()
})

test('New Transaction - Search for non-existing user', async ({ request }) => {
  await GET_getNewUserData(ctxA)
  await POST_registerUser(request, ctxA)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await transactionPage.clickCreateNewTransaction()
  await transactionPage.searchForUser('asdasd121424124sdqsdf!@#!@$12422')
  await transactionPage.verifyNoUsersFound()
})
