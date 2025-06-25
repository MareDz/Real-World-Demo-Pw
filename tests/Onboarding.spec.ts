import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_registerUser } from '../utils/apiHelpers'
import { test } from '../utils/fixturesModel'
import { getAccountNumber, getBankName, getRoutingNumber } from '../utils/fnHelpers'

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ ctx, request, onboardingPage, loginPage }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await loginPage.launchRWA()
  await loginPage.login()
  await onboardingPage.verifyGetStartedIsDisplayed()
  await onboardingPage.clickNextGetStartedAndVerifyCreateBankAccountDisplayed()
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test('[12] Onboarding Positive', async ({ onboardingPage }) => {
  await onboardingPage.completeBankAccountForm(getBankName(), getRoutingNumber(), getAccountNumber())
  await onboardingPage.verifyFinishedScreenDisplayed()
  await onboardingPage.clickDoneAndVerifyUserCredentials()
})

test('[13] Onboarding - Empty Required Fields Validation', async ({ onboardingPage }) => {
  await onboardingPage.verifyBankAccountEmptyFieldErrorHandling()
})

test('[14] Onboarding - Invalid Data Fields Validation', async ({ onboardingPage }) => {
  await onboardingPage.verifyBankAccountInvalidInputErrors()
})
