import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { Global } from '../state/Global'
import { UserData } from '../state/UserModel'

export class LoginPage extends BasePage {
  readonly page: Page
  readonly btn_signIn: Locator
  readonly lbl_loginError: Locator
  readonly lbl_signUpHeader: Locator
  readonly link_signUp: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_signIn = page.locator("[data-test='signin-submit']")
    this.lbl_loginError = page.locator("[data-test='signin-error']")
    this.lbl_signUpHeader = page.locator("[data-test='signup-title']")
    this.link_signUp = page.locator("[data-test='signup']")
  }

  /*
   * Launches the Cypress Real World App (RWA) and verifies the application loads successfully.
   *
   * Navigates to the application's URL defined in the global configuration.
   * Ensures that the page title and URL match the expected values for the login screen.
   *
   * This method serves as a starting point for test scenarios requiring access to the application.
   */
  async launchRWA() {
    console.log('launchRWA()')
    await this.page.goto(Global.url)
    await this.assertTitleAndUrl('Cypress Real World App', 'signin')
  }

/**
 * Logs in a user with the provided or fallback credentials and verifies the result based on the expected outcome.
 *
 * - If `username` or `password` is not passed, defaults to values from the test context (`this.ctx.user`).
 * - Waits for the `/login` request triggered by clicking the Sign In button.
 * - Always asserts that the login page is initially displayed before submitting credentials.
 * - After login, the response is evaluated:
 *    - If `expectSuccess` is not explicitly `false`, it assumes login should succeed and:
 *        - Asserts HTTP status 200.
 *        - Verifies navigation away from the login page by checking title and URL.
 *    - If `expectSuccess` is `false`, it assumes login should fail and:
 *        - Asserts HTTP status 401.
 *        - Verifies the login error message is shown and the page has not navigated away.
 *
 * @param expectSuccess (optional) If `false`, expects login to fail; otherwise, assumes success.
 * @param username (optional) Username to log in with; falls back to `this.ctx.user.username` if not provided.
 * @param password (optional) Password to log in with; falls back to `this.ctx.user.password` if not provided.
 */
  async login(expectSuccess?: boolean, username?: string, password?: string) {
    console.log('LoginPage - login()')

    const user_username = username ?? this.ctx.user.username
    const user_password = password ?? this.ctx.user.password

    // Login response to be captured
    const loginRequest = this.page.waitForResponse(`${Global.server_url}/login`)

    await this.assertTitleAndUrl('Cypress Real World App', 'signin')

    await this.fillAndAssert(this.inp_username, String(user_username))
    await this.fillAndAssert(this.inp_password, String(user_password))
    await this.btn_signIn.click()

    // Wait for the login response and validate based on the expected outcome
    const loginResponse = await loginRequest
    if (expectSuccess !== false) {
      // If login is expected to succeed, assert that the response status is 200 and the page title and URL are correct
      await this.assertTitleAndUrl('Cypress Real World App')
      expect(loginResponse.status()).toBe(200)
    } else {
      // If login is expected to fail, assert the error message and that the page remains on the login page
      expect(loginResponse.status()).toBe(401)
      await this.assertInnerText(this.lbl_loginError, 'Username or password is invalid')
      await this.assertTitleAndUrl('Cypress Real World App', 'signin')
    }
  }

  /**
   * Verifies error handling when login fields are empty.
   *
   * This method tests the behavior when the username field is left empty.
   * It clears the field, then checks if the appropriate error message ("Username is required") is displayed.
   * It also verifies that the "Sign In" button is disabled when the field is empty.
   */
  async verifyLoginEmptyFieldsErrorHandling() {
    console.log('LoginPage - verifyLoginEmptyFieldsErrorHandling()')
    await this.clearAndBlur(this.inp_username)
    await this.assertInnerText(this.lbl_errorUsername, 'Username is required')
    await this.btn_signIn.isDisabled()
  }

  /**
   * Verifies error handling for password field in the login form.
   *
   * This method tests the behavior when the password field contains invalid data (less than 4 characters).
   * It checks whether the appropriate error message is displayed and whether the "Sign In" button is disabled for invalid input.
   * It also verifies that the button is enabled when a valid password is entered.
   */
  async verifyLoginPasswordErrorHandling() {
    console.log('LoginPage - verifyLoginPasswordErrorHandling()')

    await this.fillAndAssert(this.inp_username, 'Random123un')
    await this.fillAndAssert(this.inp_password, '123')
    await this.inp_password.blur()
    await this.assertInnerText(this.lbl_errorPassowrd, 'Password must contain at least 4 characters')
    await this.btn_signIn.isDisabled()
    await this.fillAndAssert(this.inp_password, '1234')
    await expect(this.lbl_errorPassowrd).toHaveCount(0)
    await this.btn_signIn.isEnabled()
  }

  /**
   * Navigate to the Registration page by clicking on the Sign Up link.
   * Verifies that page title and url are displayed correctly after navigation.
   * Verifies that the Registration page label is displayed correctly after navigation.
   */
  async goToRegistrationPage() {
    console.log('LoginPage - goToRegistrationPage()')
    await this.link_signUp.click()
    await this.link_signUp.click() // Bug
    await this.assertTitleAndUrl('Cypress Real World App', 'signup')
    await expect(this.lbl_signUpHeader).toBeVisible()
  }
}
