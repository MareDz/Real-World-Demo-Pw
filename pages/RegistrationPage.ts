import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class RegistrationPage extends BasePage {
  readonly page: Page
  readonly btn_signUp: Locator
  readonly inp_confirmPassword: Locator
  readonly lbl_errorFirstName: Locator
  readonly lbl_errorLastName: Locator
  readonly lbl_errorConfirmPassword: Locator
  readonly lbl_signInHeader: Locator
  readonly link_signIn: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_signUp = page.locator("[data-test='signup-submit']")
    this.inp_confirmPassword = page.locator('#confirmPassword')
    this.lbl_errorFirstName = page.locator('#firstName-helper-text')
    this.lbl_errorLastName = page.locator('#lastName-helper-text')
    this.lbl_errorConfirmPassword = page.locator('#confirmPassword-helper-text')
    this.lbl_signInHeader = page.locator("//h1[text()='Sign in']")
    this.link_signIn = page.locator("//a[@href='/signin']")
  }

  /**
   * Fills out and submits the user registration form.
   *
   * @param firstName - Optional. The first name to register with.
   * @param lastName - Optional. The last name to register with.
   * @param username - Optional. The username to register with.
   * @param password - Optional. The password to register with (used for both password and confirm password fields).
   *
   * If a parameter is provided, it will override the corresponding value in the shared context object `this.ctx.user`.
   * The method fills all relevant input fields, verifies their values using `fillAndAssert`, and then submits the form
   * by clicking the sign-up button.
   *
   * Usage:
   *   await registrationPage.completeRegistrationForm('John', 'Doe', 'johndoe123', 'SecurePass1');
   *   // You can also omit parameters if values are already set in the context.
   */
  async completeRegistrationForm(firstName?: string, lastName?: string, username?: string, password?: string) {
    console.log('RegistrationPage - completeRegistrationForm()')

    if (firstName) this.ctx.user.firstName = firstName
    if (lastName) this.ctx.user.lastName = lastName
    if (username) this.ctx.user.username = username
    if (password) this.ctx.user.password = password

    await this.fillAndAssert(this.inp_firstName, String(this.ctx.user.firstName))
    await this.fillAndAssert(this.inp_lastName, String(this.ctx.user.lastName))
    await this.fillAndAssert(this.inp_username, String(this.ctx.user.username))
    await this.fillAndAssert(this.inp_password, String(this.ctx.user.password))
    await this.fillAndAssert(this.inp_confirmPassword, String(this.ctx.user.password))
    await this.btn_signUp.click()
  }

  /**
   * Verifies error handling for password and confirm password fields.
   *
   * Fills in mandatory fields with sample data, then tests various invalid password and confirm password inputs.
   * Verifies that appropriate error messages are displayed, and that the Sign Up button is disabled for invalid inputs.
   * Once all fields are correctly filled, the Sign Up button should be enabled.
   */
  async verifyRegistrationFormPasswordFieldsErrorHandling() {
    console.log('RegistrationPage - verifyRegistrationFormPasswordFieldsErrorHandling()')
    await this.btn_signUp.isDisabled()

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
   * For each field: 
      - Verify that error message is correct when field is left out empty
      - Verify that Sigun Up button is disabled when minimum one field is not filled
   * Verify that when all fields are filled properlly, Sign Up button is enabled
   */
  async verifyRegistrationFormEmptyFieldErrorHandling() {
    console.log('RegistrationPage - verifyRegistrationFormEmptyFieldErrorHandling()')

    await this.btn_signUp.isDisabled()
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
    await expect(this.lbl_errorFirstName).toHaveCount(0)

    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_lastName, 'Randomlastname')
    await expect(this.lbl_errorLastName).toHaveCount(0)

    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_username, 'Randomusername')
    await expect(this.lbl_errorUsername).toHaveCount(0)

    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_password, 'Randompassword123#!@j')
    await expect(this.lbl_errorPassowrd).toHaveCount(0)

    await this.btn_signUp.isDisabled()

    await this.fillAndAssert(this.inp_confirmPassword, 'Randompassword123#!@j')
    await expect(this.lbl_errorPassowrd).toHaveCount(0)

    await this.btn_signUp.isEnabled()
  }

  /*
   * Navigate to the Login page by clicking on the Sign In link.
   * Verifies that page title and url are displayed correctly after navigation.
   * Verifies that the Sign In page label is displayed correctly after navigation.
   */
  async goToLoginPage() {
    console.log('RegistrationPage - goToLoginPage()')
    await this.link_signIn.click()
    await this.link_signIn.click() // Bug
    await this.assertTitleAndUrl('Cypress Real World App', 'signin')
    await expect(this.lbl_signInHeader).toBeVisible()
  }
}
