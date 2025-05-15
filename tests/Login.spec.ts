import { Base } from '../pages/Base'
import { test } from '../utils/fixturesModel'
import { getRandomString } from '../utils/fnHelpers'

test.describe.configure({ mode: 'parallel' })
const dummyPassword = 'Pass12woRd'

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ loginPage }) => {
  await loginPage.launchRWA()
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test('Login User - Empty Required Fields Validation', async ({ loginPage }) => {
  await loginPage.verifyLoginEmptyFieldsErrorHandling()
})

test('Login User - Invalid Credentials Handling', async ({ loginPage }) => {
  await loginPage.login(false, 'randomUsername123', 'randomPassword123')
})

test('Login User - Password Field Validation', async ({ loginPage }) => {
  await loginPage.verifyLoginPasswordErrorHandling()
})

test('Login User - Case Sensitivity for Mixed Case Username Validation', async ({ registrationPage, loginPage, onboardingPage }) => {
  const mockUserMixedCaseData = getRandomString(8, 'mixed')
  const mockUserLowerCaseData = getRandomString(8, 'lower')
  const mockUserUpperCaseData = getRandomString(8, 'upper')

  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm(mockUserMixedCaseData, mockUserMixedCaseData, mockUserMixedCaseData, dummyPassword)
  await loginPage.login(false, mockUserLowerCaseData, dummyPassword)
  await loginPage.login(false, mockUserUpperCaseData, dummyPassword)
  await loginPage.login(true, mockUserMixedCaseData, dummyPassword)
  await onboardingPage.verifyGetStartedIsDisplayed()
})

test('Login User - Case Sensitivity for Upper Case Username Validation', async ({ registrationPage, loginPage, onboardingPage }) => {
  const mockUserMixedCaseData = getRandomString(8, 'mixed')
  const mockUserLowerCaseData = getRandomString(8, 'lower')
  const mockUserUpperCaseData = getRandomString(8, 'upper')

  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm(mockUserUpperCaseData, mockUserUpperCaseData, mockUserUpperCaseData, dummyPassword)
  await loginPage.login(false, mockUserLowerCaseData, dummyPassword)
  await loginPage.login(false, mockUserMixedCaseData, dummyPassword)
  await loginPage.login(true, mockUserUpperCaseData, dummyPassword)
  await onboardingPage.verifyGetStartedIsDisplayed()
})

test('Login User - Case Sensitivity for Lower Case Username Validation', async ({ registrationPage, loginPage, onboardingPage }) => {
  const mockUserMixedCaseData = getRandomString(8, 'mixed')
  const mockUserLowerCaseData = getRandomString(8, 'lower')
  const mockUserUpperCaseData = getRandomString(8, 'upper')

  await loginPage.goToRegistrationPage()
  await registrationPage.completeRegistrationForm(mockUserLowerCaseData, mockUserLowerCaseData, mockUserLowerCaseData, dummyPassword)
  await loginPage.login(false, mockUserUpperCaseData, dummyPassword)
  await loginPage.login(false, mockUserMixedCaseData, dummyPassword)
  await loginPage.login(true, mockUserLowerCaseData, dummyPassword)
  await onboardingPage.verifyGetStartedIsDisplayed()
})
