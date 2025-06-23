import test from '@playwright/test'
import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_createBankAccount, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
import { createUserData, UserData } from '../state/UserModel'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { SideNavPage } from '../pages/SideNavPage'
import { TransactionPage } from '../pages/TransactionPage'
import { getBankName, getRoutingNumber, getAccountNumber } from '../utils/fnHelpers'
import { TransactionListPage } from '../pages/TransactionListPage'

let ctxA: UserData
let ctxB: UserData
let loginPage_A: LoginPage
let onboardingPage_A: OnboardingPage
let sideNavPage_A: SideNavPage
let transactionPage_A: TransactionPage
let transactionListPage_A: TransactionListPage

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ page, request }) => {
  ctxA = createUserData()
  ctxB = createUserData()

  loginPage_A = new LoginPage(page, ctxA)
  onboardingPage_A = new OnboardingPage(page, ctxA)
  sideNavPage_A = new SideNavPage(page, ctxA)
  transactionPage_A = new TransactionPage(page, ctxA)
  transactionListPage_A = new TransactionListPage(page, ctxA)

  // Generate user 1
  await GET_getNewUserData(ctxA)
  await POST_registerUser(request, ctxA)
  await POST_loginUser(request, ctxA)
  await POST_createBankAccount(request, ctxA, getBankName(), getRoutingNumber(), getAccountNumber())
  // Generate user 2
  await GET_getNewUserData(ctxB)
  await POST_registerUser(request, ctxB)
  await POST_loginUser(request, ctxB)
  await POST_createBankAccount(request, ctxB, getBankName(), getRoutingNumber(), getAccountNumber())

  await loginPage_A.launchRWA()
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test('New Transaction - Empty Fields Validation - Demo v1', async () => {
  const { username: user2Username, firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  // Login UI User 1
  await loginPage_A.login()
  await transactionPage_A.clickCreateNewTransaction()
  // Search for user 2
  await transactionPage_A.searchForUser(String(user2Username))
  await transactionPage_A.clickOnUser(String(user2Username))
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.verifyActionsAreDisabled()
  await transactionPage_A.verifyTransactionEmptyFieldsErrorHandling()
})

test('New Transaction - Empty Fields Validation - Demo v2', async () => {
  const { username: user1Username, password: user1password } = ctxA.user
  const { username: user2Username, firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  // Login UI User 1
  await loginPage_A.login(true, user1Username, user1password)
  await transactionPage_A.clickCreateNewTransaction()
  // Search for User 2
  await transactionPage_A.searchForUser(String(user2Username))
  await transactionPage_A.clickOnUser(String(user2Username))
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  // Verify Input Error Handling
  await transactionPage_A.verifyActionsAreDisabled()
  await transactionPage_A.verifyTransactionEmptyFieldsErrorHandling()
})

test('New Transaction - Search for non-existing user', async () => {
  await loginPage_A.login()
  await transactionPage_A.clickCreateNewTransaction()
  await transactionPage_A.searchForUser('asdasd121424124sdqsdf!@#!@$12422')
  await transactionPage_A.verifyNoUsersFound()
})

test('New Transaction - Navigate to all transactions after submitting a payment', async () => {
  const { username: user2Username, firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  await loginPage_A.login()
  await transactionPage_A.clickCreateNewTransaction()
  await transactionPage_A.searchForUser(String(user2Username))
  await transactionPage_A.clickOnUser(String(user2Username))
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.fillUpAmmountAndAddNote(3500, 'Gift')
  await transactionPage_A.completeTransaction('Pay')
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.verifyTransactionMessage('Paid', 3500, 'Gift')
  await transactionPage_A.clickReturnOnTransactions()
  await transactionListPage_A.verifyActiveTab('Everyone')
})

test('New Transaction - Navigate to all transactions after submitting a request', async () => {
  const { username: user2Username, firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  await loginPage_A.login()
  await transactionPage_A.clickCreateNewTransaction()
  await transactionPage_A.searchForUser(String(user2Username))
  await transactionPage_A.clickOnUser(String(user2Username))
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.fillUpAmmountAndAddNote(3500, 'Gift')
  await transactionPage_A.completeTransaction('Request')
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.verifyTransactionMessage('Requested', 3500, 'Gift')
  await transactionPage_A.clickReturnOnTransactions()
  await transactionListPage_A.verifyActiveTab('Everyone')
})

test('New Transaction - Navigate to new transaction form after submitting a payment', async () => {
  const { username: user2Username, firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  await loginPage_A.login()
  await transactionPage_A.clickCreateNewTransaction()
  await transactionPage_A.searchForUser(String(user2Username))
  await transactionPage_A.clickOnUser(String(user2Username))
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.fillUpAmmountAndAddNote(3500, 'Gift')
  await transactionPage_A.completeTransaction('Pay')
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.verifyTransactionMessage('Paid', 3500, 'Gift')
  await transactionPage_A.clickCreateAnotherTransaction()
})

test('New Transaction - Navigate to new transaction form  after submitting a request', async () => {
  const { username: user2Username, firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  await loginPage_A.login()
  await transactionPage_A.clickCreateNewTransaction()
  await transactionPage_A.searchForUser(String(user2Username))
  await transactionPage_A.clickOnUser(String(user2Username))
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.fillUpAmmountAndAddNote(3500, 'Gift')
  await transactionPage_A.completeTransaction('Request')
  await transactionPage_A.verifyTargetUserCredentials(String(user2FirstName), String(user2LastName))
  await transactionPage_A.verifyTransactionMessage('Requested', 3500, 'Gift')
  await transactionPage_A.clickCreateAnotherTransaction()
})
