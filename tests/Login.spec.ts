import { Base } from '../pages/Base'
import { test } from '../utils/playwrightFixtures'
import { getRandomString } from '../utils/fnHelpers'

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

test('[5] Login Screen Redirections', async ({ loginPage, registrationPage }) => {
  await loginPage.goToRegistrationPage()
  await registrationPage.goToLoginPage()
})

test('[6] Login User - Empty Required Fields Validation', async ({ loginPage }) => {
  await loginPage.verifyLoginEmptyFieldsErrorHandling()
})

test('[7] Login User - Invalid Credentials Handling', async ({ loginPage }) => {
  await loginPage.login(false, 'randomUsername123', 'randomPassword123')
})

test('[8] Login User - Password Field Validation', async ({ loginPage }) => {
  await loginPage.verifyLoginPasswordErrorHandling()
})

test('[9] Login User - Case Sensitivity for Mixed Case Username Validation', async ({ registrationPage, loginPage, onboardingPage }) => {
  const mockUserMixedCaseData = getRandomString(8, 'mixed')
  const mockUserLowerCaseData = getRandomString(8, 'lower')
  const mockUserUpperCaseData = getRandomString(8, 'upper')

  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm(mockUserMixedCaseData, mockUserMixedCaseData, mockUserMixedCaseData, '12bc24')
  await loginPage.login(false, mockUserLowerCaseData)
  await loginPage.login(false, mockUserUpperCaseData)
  await loginPage.login(true, mockUserMixedCaseData)
  await onboardingPage.verifyGetStartedIsDisplayed()
})

test('[10] Login User - Case Sensitivity for Upper Case Username Validation', async ({ registrationPage, loginPage, onboardingPage }) => {
  const mockUserMixedCaseData = getRandomString(8, 'mixed')
  const mockUserLowerCaseData = getRandomString(8, 'lower')
  const mockUserUpperCaseData = getRandomString(8, 'upper')

  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm(mockUserUpperCaseData, mockUserUpperCaseData, mockUserUpperCaseData, '12bc24')
  await loginPage.login(false, mockUserLowerCaseData)
  await loginPage.login(false, mockUserMixedCaseData)
  await loginPage.login(true, mockUserUpperCaseData)
  await onboardingPage.verifyGetStartedIsDisplayed()
})

test('[11] Login User - Case Sensitivity for Lower Case Username Validation', async ({ registrationPage, loginPage, onboardingPage }) => {
  const mockUserMixedCaseData = getRandomString(8, 'mixed')
  const mockUserLowerCaseData = getRandomString(8, 'lower')
  const mockUserUpperCaseData = getRandomString(8, 'upper')

  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm(mockUserLowerCaseData, mockUserLowerCaseData, mockUserLowerCaseData, '12bc24')
  await loginPage.login(false, mockUserUpperCaseData)
  await loginPage.login(false, mockUserMixedCaseData)
  await loginPage.login(true, mockUserLowerCaseData)
  await onboardingPage.verifyGetStartedIsDisplayed()
})
