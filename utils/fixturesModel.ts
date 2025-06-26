import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'
import { test as base } from '@playwright/test'
import { createUserData, UserData } from '../state/UserModel'
import { OnboardingPage } from '../pages/OnboardingPage'
import { SideNavPage } from '../pages/SideNavPage'
import { MyAccountPage } from '../pages/MyAccountPage'
import { BankAccountPage } from '../pages/BankAccountPage'
import { NewTransactionPage } from '../pages/NewTransactionPage'
import { TransactionDetailsPage } from '../pages/TransactionDetailsPage'
import { TransactionListPage } from '../pages/TransactionListPage'

type Fixtures = {
  loginPage: LoginPage
  registrationPage: RegistrationPage
  onboardingPage: OnboardingPage
  sideNavPage: SideNavPage
  myAccountPage: MyAccountPage
  bankAccountPage: BankAccountPage
  newTransactionPage: NewTransactionPage
  transactionDetailsPage: TransactionDetailsPage
  transactionListPage: TransactionListPage
  ctx: UserData
}

export const test = base.extend<Fixtures>({
  /**
   * Test Context Isolation:
   *
   * The `ctx` (test context) fixture is used to isolate and manage test data (e.g. user details, bank account info)
   * in memory for each individual test case.
   *
   * How it works:
   * - Each test gets its own fresh instance of `ctx` by calling `createUserData()`.
   * - This ensures no shared state between tests, preventing side effects and making tests safe to run in parallel.
   * - The `ctx` object is passed into page objects so that data like `userID`, `username`, `balance`, etc.
   *   can be stored, updated, and reused across different steps and assertions during the test lifecycle.
   *
   * Benefits:
   * - Ensures test isolation and reproducibility.
   * - Avoids leaking test data across tests.
   * - Simplifies test data handling by centralizing state management.
   */
  ctx: async ({}, use) => {
    const ctx = createUserData()
    await use(ctx)
  },

  loginPage: async ({ page, ctx }, use) => {
    await use(new LoginPage(page, ctx))
  },

  registrationPage: async ({ page, ctx }, use) => {
    await use(new RegistrationPage(page, ctx))
  },

  onboardingPage: async ({ page, ctx }, use) => {
    await use(new OnboardingPage(page, ctx))
  },

  sideNavPage: async ({ page, ctx }, use) => {
    await use(new SideNavPage(page, ctx))
  },

  myAccountPage: async ({ page, ctx }, use) => {
    await use(new MyAccountPage(page, ctx))
  },

  bankAccountPage: async ({ page, ctx }, use) => {
    await use(new BankAccountPage(page, ctx))
  },

  newTransactionPage: async ({ page, ctx }, use) => {
    await use(new NewTransactionPage(page, ctx))
  },

  transactionDetailsPage: async ({ page, ctx }, use) => {
    await use(new TransactionDetailsPage(page, ctx))
  },

  transactionListPage: async ({ page, ctx }, use) => {
    await use(new TransactionListPage(page, ctx))
  },
})
