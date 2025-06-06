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

test('My Account - Verify Data for Partially-Configured/New User', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await loginPage.launchRWA()
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails('', '')   
})
