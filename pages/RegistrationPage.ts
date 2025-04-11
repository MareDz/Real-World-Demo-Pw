import { APIRequestContext, Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { TestContext } from '../state/TestContext'
// import { GET_getNewUserData } from '../utils/apiHelpers'

export class RegistrationPage extends BasePage {
  readonly page: Page
  readonly btn_signUp: Locator
  readonly inp_confirmPassword: Locator
  readonly lbl_errorFirstName: Locator
  readonly lbl_errorLastName: Locator
  readonly lbl_errorConfirmPassword: Locator
  readonly link_signIn: Locator

  constructor(page: Page, testContext: TestContext) {
    super(page, testContext)
    this.page = page
    this.testContext = testContext
    this.btn_signUp = page.locator("[data-test='signup-submit']")
    this.inp_confirmPassword = page.locator('#confirmPassword')
    this.lbl_errorFirstName = page.locator('#firstName-helper-text')
    this.lbl_errorLastName = page.locator('#lastName-helper-text')
    this.lbl_errorConfirmPassword = page.locator('#confirmPassword-helper-text')
    this.link_signIn = page.locator("//a[@href='/signin']")
  }

  /**
   * Fills out the user registration form and submits it by clicking the 'Sign Up' button.
   *
   * - If called in conjunction with `generateAndRegisterNewUser()`, the necessary user data is already set in the context.
   * - If called independently, ensures that all required user data (first name, last name, username, password) is provided as input parameters.
   *
   * @param firstName - The user's first name to be filled in the registration form.
   * @param lastName - The user's last name to be filled in the registration form.
   * @param username - The user's username to be filled in the registration form.
   * @param password - The user's password to be filled in the registration form (also used to confirm password).
   */
  async completeRegistrationForm(firstName: string, lastName: string, username: string, password: string) {
    console.log('RegistrationPage - completeRegistrationForm()')

    this.testContext.userdata.user.firstName = firstName
    this.testContext.userdata.user.lastName = lastName
    this.testContext.userdata.user.username = username
    this.testContext.userdata.user.password = password

    await this.fillAndAssert(this.inp_firstName, firstName)
    await this.fillAndAssert(this.inp_lastName, lastName)
    await this.fillAndAssert(this.inp_username, username)
    await this.fillAndAssert(this.inp_password, password)
    await this.fillAndAssert(this.inp_confirmPassword, password)
    await this.btn_signUp.click()
  }

  /*
  * Generates random user data via an API call and completes the registration process.
  *
  * - Calls the `GET_getNewUserData()` function to fetch random user data and update the test context.
  * - Destructures the received data (firstName, lastName, username, and password) from the context.
  * - Uses the destructured data to complete and submit the registration form.
  * 
  * @param request - The API request context used for making API calls.
  */
  async generateAndRegisterNewUser(request: APIRequestContext) {
    console.log('RegisterPage - generateAndRegisterNewUser()')

    // await GET_getNewUserData(request, this.testContext)
    const { firstName, lastName, username, password } = this.testContext.userdata.user

    await this.completeRegistrationForm(String(firstName), String(lastName), String(username), String(password))
  }

  /**
   * Verifies error handling for password and confirm password fields.
   *
   * Fills in mandatory fields with sample data, then tests various invalid password and confirm password inputs.
   * Verifies that appropriate error messages are displayed, and that the Sign Up button is disabled for invalid inputs.
   * Once all fields are correctly filled, the Sign Up button should be enabled.
   */
  async verifyPasswordFieldsErrorHandling() {
    console.log('RegistrationPage - verifyPasswordFieldsErrorHandling()')
    await this.fillAndAssert(this.inp_firstName, 'Rndfirstname')
    await this.fillAndAssert(this.inp_lastName, 'Rndlastname')
    await this.fillAndAssert(this.inp_username, 'Rndusername')

    await this.clearAndBlur(this.inp_password)
    await this.assertInnerText(this.lbl_errorPassowrd, 'Enter your password')
    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_password, '123')
    await this.inp_password.blur()
    await this.assertInnerText(this.lbl_errorPassowrd, 'Password must contain at least 4 characters')
    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_password, '1234')
    await expect(this.lbl_errorPassowrd).toHaveCount(0)
    await this.fillAndAssert(this.inp_confirmPassword, '12345')
    await this.inp_confirmPassword.blur()
    await this.assertInnerText(this.lbl_errorConfirmPassword, 'Password does not match')
    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_password, '12345')
    await this.fillAndAssert(this.inp_confirmPassword, '12345')
    await expect(this.lbl_errorPassowrd).toHaveCount(0)
    await expect(this.lbl_errorConfirmPassword).toHaveCount(0)
    await this.btn_signUp.isEnabled()
  }

  /*
   * Verify that each field has appropriate error message when field is empty
   * Verify that Sign Up button is displayed when fields are empty
   * Verify that Sign Up button is enabled when all input fields has valid data
   */
  async verifyRegistrationEmptyFieldErrorHandling() {
    console.log('RegistrationPage - verifyRegistrationEmptyFieldErrorHandling()')
    await this.clearAndBlur(this.inp_firstName)
    await this.assertInnerText(this.lbl_errorFirstName, 'First Name is required')
    await this.btn_signUp.isDisabled()
    await this.clearAndBlur(this.inp_lastName)
    await this.assertInnerText(this.lbl_errorLastName, 'Last Name is required')
    await this.btn_signUp.isDisabled()
    await this.clearAndBlur(this.inp_username)
    await this.assertInnerText(this.lbl_errorUsername, 'Username is required')
    await this.btn_signUp.isDisabled()
    await this.clearAndBlur(this.inp_password)
    await this.assertInnerText(this.lbl_errorPassowrd, 'Enter your password')
    await this.btn_signUp.isDisabled()
    await this.clearAndBlur(this.inp_confirmPassword)
    await this.assertInnerText(this.lbl_errorConfirmPassword, 'Confirm your password')
    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_firstName, 'Randomfirstname')
    await this.btn_signUp.isDisabled()
    await this.fillAndAssert(this.inp_lastName, 'Randomlastname')
    await this.btn_signUp.isDisabled()
    await this.fillAndAssert(this.inp_username, 'Randomusername')
    await this.btn_signUp.isDisabled()
    await this.fillAndAssert(this.inp_password, 'Randompassword123#!@j')
    await this.btn_signUp.isDisabled()
    await this.fillAndAssert(this.inp_confirmPassword, 'Randompassword123#!@j')
    await this.btn_signUp.isEnabled()
  }

  /*
   * Click on link to go on Login page
   * Verify that registration page is displayed
   */
  async goToLoginPage() {
    console.log('RegistrationPage - goToLoginPage()')
    await this.link_signIn.click()
    await this.link_signIn.click() // Bug
    await this.assertTitleAndUrl('Cypress Real World App', 'signin')
  }
}
