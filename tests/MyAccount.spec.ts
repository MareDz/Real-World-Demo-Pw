import { Base } from '../pages/Base'
import { GET_getNewUserData, PATCH_completeAccountDetails, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
import { test } from '../utils/fixturesModel'

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ loginPage, ctx, request }) => {
  await loginPage.launchRWA()
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test('My Account - Verify Data for Partially-Configured/New User', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails('', '')
})

test('My Account - Verify Data for Fully Configured User', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails()
})

test('My Account - Empty Fields Validation', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyAccountDetailsEmptyFieldsErrorHandling()
})

test('My Account -  Invalid Data Fields Validation', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyAccountDetailsFieldsErrorHandling()
})

test('My Account - Edit User Details', async ({ page, ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.editAccountDetails(`Edited${ctx.user.firstName}`, `Edited${ctx.user.lastName}`, `Edited${ctx.user.email}`, `123${ctx.user.phone}`)
  await page.reload()
  await myAccountPage.verifyDisplayedAccountDetails()
  await sideNavPage.logout()
  await loginPage.login()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails()
})
