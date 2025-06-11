import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_createBankAccount, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
import { test } from '../utils/fixturesModel'
import { getAccountNumber, getBankName, getRoutingNumber } from '../utils/fnHelpers'

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ loginPage }) => {
  await loginPage.launchRWA()
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test('Bank Account - Created Bank Account During Onboarding Process Displayed in Bank Details', async ({ ctx, registrationPage, loginPage, onboardingPage, sideNavPage, bankAccountPage }) => {
  await GET_getNewUserData(ctx)
  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm()
  await loginPage.login()
  await onboardingPage.verifyGetStartedIsDisplayed()
  await onboardingPage.clickNextGetStartedAndVerifyCreateBankAccountDisplayed()
  await onboardingPage.completeBankAccountForm(getBankName(), getRoutingNumber(), getAccountNumber())
  await onboardingPage.verifyFinishedScreenDisplayed()
  await onboardingPage.clickDoneAndVerifyUserCredentials()
  await sideNavPage.goToBankAccounts()
  await bankAccountPage.verifyBankAccountDisplayed()
})

test('Bank Account - Created Initial Bank Account (from API) Displayed in Bank Details', async ({ ctx, request, loginPage, sideNavPage, bankAccountPage }) => {
    await GET_getNewUserData(ctx)
    await POST_registerUser(request, ctx)
    await POST_loginUser(request, ctx)
    await POST_createBankAccount(request, ctx, getBankName(), getRoutingNumber(), getAccountNumber())
    await loginPage.login()
    await sideNavPage.goToBankAccounts()
    await bankAccountPage.verifyBankAccountDisplayed()
})

test('Bank Account - Empty Required Fields Validation', async ({ ctx, request, loginPage, sideNavPage, bankAccountPage }) => {
    await GET_getNewUserData(ctx)
    await POST_registerUser(request, ctx)
    await POST_loginUser(request, ctx)
    await POST_createBankAccount(request, ctx, getBankName(), getRoutingNumber(), getAccountNumber())
    await loginPage.login()
    await sideNavPage.goToBankAccounts()
    await bankAccountPage.clickCreateNewBankAccount()
    await bankAccountPage.verifyBankAccountEmptyFieldErrorHandling()
})

test('Bank Account - Invalid Data Fields Validation', async ({ ctx, request, loginPage, sideNavPage, bankAccountPage }) => {
    await GET_getNewUserData(ctx)
    await POST_registerUser(request, ctx)
    await POST_loginUser(request, ctx)
    await POST_createBankAccount(request, ctx, getBankName(), getRoutingNumber(), getAccountNumber())
    await loginPage.login()
    await sideNavPage.goToBankAccounts()
    await bankAccountPage.clickCreateNewBankAccount()
    await bankAccountPage.verifyBankAccountInvalidInputErrors()
})

test('Bank Account - Add New Bank Account', async ({ page, ctx, request, loginPage, sideNavPage, bankAccountPage }) => {
    await GET_getNewUserData(ctx)
    await POST_registerUser(request, ctx)
    await POST_loginUser(request, ctx)
    await POST_createBankAccount(request, ctx, getBankName(), getRoutingNumber(), getAccountNumber())
    await loginPage.login()
    await sideNavPage.goToBankAccounts()
    await bankAccountPage.clickCreateNewBankAccount()
    await bankAccountPage.addNewBankAccount()
    await bankAccountPage.verifyBankAccountDisplayed()
    await bankAccountPage.clickCreateNewBankAccount()
    await bankAccountPage.addNewBankAccount()
    await bankAccountPage.verifyBankAccountDisplayed()
    await bankAccountPage.clickCreateNewBankAccount()
    await bankAccountPage.addNewBankAccount()
    await bankAccountPage.verifyBankAccountDisplayed()
})