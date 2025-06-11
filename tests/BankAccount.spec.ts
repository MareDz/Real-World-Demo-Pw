import { Base } from '../pages/Base'
import { GET_getNewUserData, POST_registerUser } from '../utils/apiHelpers'
import { test } from '../utils/fixturesModel'
import { getAccountNumber, getBankName, getRoutingNumber } from '../utils/fnHelpers'

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ ctx, request, loginPage, onboardingPage}) => {
//   await GET_getNewUserData(ctx)
//   await POST_registerUser(request, ctx)
//   await loginPage.launchRWA()
//   await loginPage.login()
//   await onboardingPage.completeOnboardingProcessWithRandomBankData()
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test.only('Bank Account - Created Bank Account During Onboarding Process Displayed in Bank Details', async ({ ctx, registrationPage, loginPage, onboardingPage, sideNavPage, bankAccountPage }) => {
    await GET_getNewUserData(ctx)
  await loginPage.launchRWA()
  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm()
  await loginPage.login()
  await onboardingPage.completeBankAccountForm(getBankName(), getRoutingNumber(), getAccountNumber())
  await onboardingPage.verifyFinishedScreenDisplayed()
  await onboardingPage.clickDoneAndVerifyUserCredentials()
  await sideNavPage.goToBankAccounts()
})

test.skip('Bank Account - Empty Required Fields Validation', async ({ loginPage, sideNavPage }) => {
    await sideNavPage.goToBankAccounts()

})
