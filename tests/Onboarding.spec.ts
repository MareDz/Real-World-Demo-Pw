import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_registerUser } from '../utils/apiHelpers'
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

test('Onboarding Positive', async ({ ctx, request, loginPage, onboardingPage }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await loginPage.launchRWA()
  await loginPage.login()
  await onboardingPage.verifyGetStartedIsDisplayed()
  await onboardingPage.clickNextGetStartedAndVerifyCreateBankAccountDisplayed()
  await onboardingPage.completeBankAccountForm(getBankName(), getRoutingNumber(), getAccountNumber())
  await onboardingPage.verifyFinishedScreenDisplayed()
  await onboardingPage.clickDoneAndVerifyUserCredentials()
})

test.only('Onboarding - Empty Required Fields Validation', async ({ ctx, request, loginPage, onboardingPage, page }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await loginPage.launchRWA()
  await loginPage.login()
  await onboardingPage.verifyGetStartedIsDisplayed()
  await onboardingPage.clickNextGetStartedAndVerifyCreateBankAccountDisplayed()
  await onboardingPage.verifyBankAccountEmptyFieldErrorHandling()
})
