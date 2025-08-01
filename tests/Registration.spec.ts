import { Base } from '../pages/Base'
import { GET_getNewUserData } from '../utils/apiHelpers'
import { test } from '../utils/playwrightFixtures'

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

test('[1] Register New User - Empty Required Fields Validation', async ({ loginPage, registrationPage }) => {
  await loginPage.goToRegistrationPage()
  await registrationPage.verifyRegistrationFormEmptyFieldErrorHandling()
})

test('[2] Register New User - Password Fields Validations', async ({ loginPage, registrationPage }) => {
  await loginPage.goToRegistrationPage()
  await registrationPage.verifyRegistrationFormPasswordFieldsErrorHandling()
})

test('[3] Register New User - Positive', async ({ ctx, loginPage, registrationPage, onboardingPage }) => {
  await GET_getNewUserData(ctx)
  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm()
  await loginPage.login()
  await onboardingPage.verifyGetStartedIsDisplayed()
})
