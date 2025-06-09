import { Base } from '../pages/Base'
import { GET_getNewUserData, PATCH_completeAccountDetails, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
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

test('My Account - Verify Data for Partially-Configured/New User', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await loginPage.launchRWA()
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails('', '')
})

test('My Account - Verify Data for Fully Configured User', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.launchRWA()
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails()
})

test.only('My Account - Empty Fields Validation', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.launchRWA()
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyAccountDetailsEmptyFieldsErrorHandling()
})
