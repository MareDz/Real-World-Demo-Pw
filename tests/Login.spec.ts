import { test } from './fixturesModel'
import { Base } from '../pages/Base'

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

test('Login User - Empty Required Fields Validation', async ({ loginPage }) => {
    await loginPage.verifyLoginEmptyFieldsErrorHandling()
})

test('Login User - Invalid Credentials Handling', async ({ loginPage }) => {
    await loginPage.login(false, 'randomUsername123', 'randomPassword123')
})

test('Login User - Password Field Validation', async ({ loginPage }) => {
    await loginPage.verifyLoginPasswordErrorHandling()
})

test.only('Login User - Case Sensitivity for Mixed Case Username Validation', async ({ registrationPage, loginPage }) => {
    await loginPage.goToRegistrationPage()

    await registrationPage.completeRegistrationForm('RndFn', 'RndLn', 'RndUn', 'Pass12woRd')
    await loginPage.login(false, 'rndun')
    await loginPage.login(false, 'RNDUN')

})


