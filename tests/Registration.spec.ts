import { test } from './fixturesModel'
import { Base } from '../pages/Base'
import { getNewUserData } from '../utils/apiHelpers'

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

test('Register New User - Empty Required Fields Validation', async ({ loginPage, registrationPage }) => {
  await loginPage.goToRegistrationPage()
  await registrationPage.verifyRegistrationFormEmptyFieldErrorHandling()
})

test('Register New User - Password Fields Validations', async ({ loginPage, registrationPage }) => {
  await loginPage.goToRegistrationPage()
  await registrationPage.verifyRegistrationFormPasswordFieldsErrorHandling()
})

test('Register New User - Positive', async ({ ctx, loginPage, registrationPage, onboardingPage }) => {
  await getNewUserData(ctx)
  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm()
  await loginPage.login()
  await onboardingPage.verifyGetStartedIsDisplayed()
})
