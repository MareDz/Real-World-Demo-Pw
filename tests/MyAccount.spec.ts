import { Base } from '../pages/Base'
import { GET_getNewUserData, PATCH_completeAccountDetails, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
import { test } from '../utils/playwrightFixtures'

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

/***  NOTES  ***/
/*
1. To speed up user setup, we create users via API to bypass unnecessary UI flows.
   - Creating users with all variations is already thoroughly covered in the appropriate spec file.

2. Abstracted vs. Step-by-Step actions in `completeOnboardingProcessWithRandomBankData()`
   - The onboarding process is not the focus of these test cases, which is why we abstract it here to keep the test concise and readable.
   - A detailed, step-by-step version of the onboarding process (without abstraction) is covered in its dedicated spec file.
   - Pros of this abstraction: Cleaner, more maintainable test code when onboarding is not the subject under test.
   - Cons of this abstraction: Slightly harder to debug issues within the onboarding flow, but that risk is mitigated by having separate tests focused on it.
*/
test('[16] My Account - Verify Data for Partially-Configured/New User', async ({ loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails('', '')
})

test('[17] My Account - Verify Data for Fully Configured User', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyDisplayedAccountDetails()
})

test('[18] My Account - Empty Fields Validation', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyAccountDetailsEmptyFieldsErrorHandling()
})

test('[19] My Account -  Invalid Data Fields Validation', async ({ ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx)
  await loginPage.login()
  await onboardingPage.completeOnboardingProcessWithRandomBankData()
  await sideNavPage.goToMyAccount()
  await myAccountPage.verifyAccountDetailsFieldsErrorHandling()
})

test('[20] My Account - Edit User Details', async ({ page, ctx, request, loginPage, onboardingPage, myAccountPage, sideNavPage }) => {
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
