import test from '@playwright/test'
import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_createBankAccount, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
import { createUserData, UserData } from '../state/UserModel'
import { LoginPage } from '../pages/LoginPage'
import { SideNavPage } from '../pages/SideNavPage'
import { NewTransactionPage } from '../pages/NewTransactionPage'
import { getBankName, getRoutingNumber, getAccountNumber, verifyBalanceChangeAfterPaying, verifyBalanceChangeAfterReceiving, verifyBalanceNotChanged } from '../utils/fnHelpers'
import { TransactionListPage } from '../pages/TransactionListPage'
import { TransactionDetailsPage } from '../pages/TransactionDetailsPage'

let ctxA: UserData
let ctxB: UserData
let loginPage_A: LoginPage
let sideNavPage_A: SideNavPage
let transactionPage_A: NewTransactionPage
let transactionListPage_A: TransactionListPage
let transactionDetailsPage_A: TransactionDetailsPage
let loginPage_B: LoginPage
let sideNavPage_B: SideNavPage
let transactionPage_B: NewTransactionPage

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ page, request }) => {
  ctxA = createUserData()
  ctxB = createUserData()

  loginPage_A = new LoginPage(page, ctxA)
  sideNavPage_A = new SideNavPage(page, ctxA)
  transactionPage_A = new NewTransactionPage(page, ctxA)
  transactionListPage_A = new TransactionListPage(page, ctxA)
  transactionDetailsPage_A = new TransactionDetailsPage(page, ctxA)

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

test('[29] New Transaction - Empty Fields Validation - Demo v1', async () => {
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

test('[29a] New Transaction - Empty Fields Validation - Demo v2', async () => {
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

test('[30] New Transaction - Search for non-existing user', async () => {
  await loginPage_A.login()
  await transactionPage_A.clickCreateNewTransaction()
  await transactionPage_A.searchForUser('asdasd121424124sdqsdf!@#!@$12422')
  await transactionPage_A.verifyNoUsersFound()
})

test('[31] New Transaction - Navigate to all transactions after submitting a payment', async () => {
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

test('[32] New Transaction - Navigate to all transactions after submitting a request', async () => {
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

test('[33] New Transaction - Navigate to new transaction form after submitting a payment', async () => {
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

test('[34] New Transaction - Navigate to new transaction form  after submitting a request', async () => {
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

test('[35] New Transaction - Submit a payment and verify transaction details', async ({ page }) => {
  loginPage_B = new LoginPage(page, ctxB)
  sideNavPage_B = new SideNavPage(page, ctxB)
  transactionPage_B = new NewTransactionPage(page, ctxB)

  const { username: user1Username, firstName: user1FirstName, lastName: user1LastName } = ctxA.user
  const { firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  // User 1
  await loginPage_A.login()
  await sideNavPage_A.getAccountBalance()
  await sideNavPage_A.logout()

  // User 2
  await loginPage_B.login()
  await sideNavPage_B.getAccountBalance()
  await transactionPage_B.clickCreateNewTransaction()
  await transactionPage_B.searchForUser(String(user1Username))
  await transactionPage_B.clickOnUser(String(user1Username))
  await transactionPage_B.fillUpAmmountAndAddNote(20, 'Testing 123')
  await transactionPage_B.completeTransaction('Pay')
  await transactionPage_B.verifyTargetUserCredentials(String(user1FirstName), String(user1LastName))
  await page.waitForTimeout(4000)
  verifyBalanceChangeAfterPaying(Number(ctxB.bank.balance), Number(ctxB.bank.transactionAmmount), await sideNavPage_B.getAccountBalance())
  await sideNavPage_B.logout()

  // User 1
  await loginPage_A.login()
  verifyBalanceChangeAfterReceiving(Number(ctxA.bank.balance), Number(ctxB.bank.transactionAmmount), await sideNavPage_A.getAccountBalance())
  await transactionListPage_A.goToTab('Mine')
  await transactionListPage_A.verifyMineLastTransaction(`${user2FirstName} ${user2LastName}`, `${user1FirstName} ${user1LastName}`, `${ctxB.bank.note}`, `-${ctxB.bank.transactionAmmount}`, 0, 0, 'paid')
  await transactionListPage_A.clickOnLastTransaction()
  await transactionDetailsPage_A.verifyTransactionDetails(`${user2FirstName} ${user2LastName}`, `${user1FirstName} ${user1LastName}`, `${ctxB.bank.note}`, `-${ctxB.bank.transactionAmmount}`, 0, 0, 'paid')
})

/**
 * BUG REPORT:
 * Scenario:
 * - User 2 requests an amount of money from User 1.
 * - User 1 rejects the transaction request.
 *
 * Expected Behavior:
 * - User 2's account balance should remain unchanged.
 *
 * Actual Behavior:
 * - User 2's account balance is increased after the request is rejected.
 *
 * NOTE:
 * - BUG happens on the last line of code in this test aka. last step -> verifyBalanceNotChanged(Number(ctxB.bank.balance), await sideNavPage_B.getAccountBalance())
 */
test('[36] New Transaction - Request a payment, Reject request and verify transaction details', async ({ page }) => {
  loginPage_B = new LoginPage(page, ctxB)
  sideNavPage_B = new SideNavPage(page, ctxB)
  transactionPage_B = new NewTransactionPage(page, ctxB)

  const { username: user1Username, firstName: user1FirstName, lastName: user1LastName } = ctxA.user
  const { firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  // User 1
  await loginPage_A.login()
  await sideNavPage_A.getAccountBalance()
  await sideNavPage_A.logout()

  // User 2
  await loginPage_B.login()
  await sideNavPage_B.getAccountBalance()
  await transactionPage_B.clickCreateNewTransaction()
  await transactionPage_B.searchForUser(String(user1Username))
  await transactionPage_B.clickOnUser(String(user1Username))
  await transactionPage_B.fillUpAmmountAndAddNote(40, 'Testing 123')
  await transactionPage_B.completeTransaction('Request')
  await transactionPage_B.verifyTargetUserCredentials(String(user1FirstName), String(user1LastName))
  await page.waitForTimeout(4000)
  verifyBalanceNotChanged(Number(ctxB.bank.balance), await sideNavPage_B.getAccountBalance())
  await sideNavPage_B.logout()

  // User 1
  await loginPage_A.login()
  await transactionListPage_A.goToTab('Mine')
  await transactionListPage_A.verifyMineLastTransaction(`${user2FirstName} ${user2LastName}`, `${user1FirstName} ${user1LastName}`, `${ctxB.bank.note}`, `+${ctxB.bank.transactionAmmount}`, 0, 0, 'requested')
  await transactionListPage_A.clickOnLastTransaction()
  await transactionDetailsPage_A.verifyTransactionDetails(`${user2FirstName} ${user2LastName}`, `${user1FirstName} ${user1LastName}`, `${ctxB.bank.note}`, `+${ctxB.bank.transactionAmmount}`, 0, 0, 'requested')
  await transactionDetailsPage_A.clickRejectRequest()
  verifyBalanceNotChanged(Number(ctxA.bank.balance), await sideNavPage_A.getAccountBalance())
  await sideNavPage_A.logout()

  // User 2
  await loginPage_B.login()
  verifyBalanceNotChanged(Number(ctxB.bank.balance), await sideNavPage_B.getAccountBalance()) // BUG
})

/**
 * BUG REPORT:
 * Scenario:
 * - User 2 requests an amount of money from User 1.
 * - User 1 accepts the transaction request.
 *
 * Expected Behavior:
 * - User 1's account balance should be lowered for requested amount.
 *
 * Actual Behavior:
 * - User 1's account balance is unchaged after the request is accepted.
 * - User 1's account balance is unchaged after the request is accepted, even when re hard-refresh the page.
 * - User 1's account balance is lowered for requested amount only if user perform logout then login.
 *
 * NOTE:
 * - To bypass this bug 'for demonstration purpose', remove comments from this 2 lines of code
 *   // await sideNavPage_A.logout()
 *   // await loginPage_A.login()
 */
test('[37] New Transaction - Request a payment, Accept request and verify transaction details', async ({ page }) => {
  loginPage_B = new LoginPage(page, ctxB)
  sideNavPage_B = new SideNavPage(page, ctxB)
  transactionPage_B = new NewTransactionPage(page, ctxB)

  const { username: user1Username, firstName: user1FirstName, lastName: user1LastName } = ctxA.user
  const { firstName: user2FirstName, lastName: user2LastName } = ctxB.user

  // User 1
  await loginPage_A.login()
  await sideNavPage_A.getAccountBalance()
  await sideNavPage_A.logout()

  // User 2
  await loginPage_B.login()
  await sideNavPage_B.getAccountBalance()
  await transactionPage_B.clickCreateNewTransaction()
  await transactionPage_B.searchForUser(String(user1Username))
  await transactionPage_B.clickOnUser(String(user1Username))
  await transactionPage_B.fillUpAmmountAndAddNote(40, 'Testing 123')
  await transactionPage_B.completeTransaction('Request')
  await transactionPage_B.verifyTargetUserCredentials(String(user1FirstName), String(user1LastName))
  await page.waitForTimeout(4000)
  verifyBalanceNotChanged(Number(ctxB.bank.balance), await sideNavPage_B.getAccountBalance())
  await sideNavPage_B.logout()

  // User 1
  await loginPage_A.login()
  await transactionListPage_A.goToTab('Mine')
  await transactionListPage_A.verifyMineLastTransaction(`${user2FirstName} ${user2LastName}`, `${user1FirstName} ${user1LastName}`, `${ctxB.bank.note}`, `+${ctxB.bank.transactionAmmount}`, 0, 0, 'requested')
  await transactionListPage_A.clickOnLastTransaction()
  await transactionDetailsPage_A.verifyTransactionDetails(`${user2FirstName} ${user2LastName}`, `${user1FirstName} ${user1LastName}`, `${ctxB.bank.note}`, `+${ctxB.bank.transactionAmmount}`, 0, 0, 'requested')
  await transactionDetailsPage_A.clickAcceptRequest()
  // await sideNavPage_A.logout()
  // await loginPage_A.login()

  verifyBalanceChangeAfterPaying(Number(ctxA.bank.balance), Number(ctxB.bank.transactionAmmount), await sideNavPage_A.getAccountBalance())
  await sideNavPage_A.logout()
  await loginPage_B.login()
  verifyBalanceChangeAfterReceiving(Number(ctxB.bank.balance), Number(ctxB.bank.transactionAmmount), await sideNavPage_A.getAccountBalance())
})
