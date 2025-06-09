import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class MyAccountPage extends BasePage {
  readonly page: Page
  readonly btn_save: Locator
  readonly inp_email: Locator
  readonly inp_phoneNumber: Locator
  readonly lbl_errorFirstName: Locator
  readonly lbl_errorLastName: Locator
  readonly lbl_errorEmail: Locator
  readonly lbl_errorPhoneNumber: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_save = page.locator("[data-test='user-settings-submit']")
    this.inp_email = page.locator("[data-test='user-settings-email-input']")
    this.inp_phoneNumber = page.locator("[data-test='user-settings-phoneNumber-input']")
    this.lbl_errorFirstName = page.locator("[id='user-settings-firstName-input-helper-text']")
    this.lbl_errorLastName = page.locator("[id='user-settings-lastName-input-helper-text']")
    this.lbl_errorEmail = page.locator("[id='user-settings-email-input-helper-text']")
    this.lbl_errorPhoneNumber = page.locator("[id='user-settings-phoneNumber-input-helper-text']")
  }

  /**
   * Verifies that the user account details displayed on the UI match the expected values.
   *
   * This function checks the displayed values for first name, last name, email, and phone number.
   * If any of the parameters are not provided, it falls back to using the values stored in the context.
   * This ensures that the function can work with both provided and default (context) values for validation.
   *
   * @param param_firstName - The first name to check on the UI (optional). Falls back to context if not provided.
   * @param param_lastName - The last name to check on the UI (optional). Falls back to context if not provided.
   * @param param_email - The email to check on the UI (optional). Falls back to context if not provided.
   * @param param_phone - The phone number to check on the UI (optional). Falls back to context if not provided.
   */
  async verifyDisplayedAccountDetails(param_email?: string, param_phone?: string, param_firstName?: string, param_lastName?: string) {
    console.log('MyAccount - verifyDisplayedAccountDetails()')

    const firstName = param_firstName ?? this.ctx.user.firstName
    const lastName = param_lastName ?? this.ctx.user.lastName
    const email = param_email ?? this.ctx.user.email
    const phone = param_phone ?? this.ctx.user.phone

    await this.assertInputValue(this.inp_firstName, String(firstName))
    await this.assertInputValue(this.inp_lastName, String(lastName))
    await this.assertInputValue(this.inp_email, String(email))
    await this.assertInputValue(this.inp_phoneNumber, String(phone))
  }

  /**
   * Verifies error handling when required fields are left empty and when valid data is entered.
   *
   * This function tests the behavior when attempting to save account details with empty fields, ensuring that
   * proper error messages are displayed for each field, and the save button is disabled. It then checks that when
   * valid data is provided, the save button becomes enabled and error messages are not visible.
   */
  async verifyAccountDetailsEmptyFieldsErrorHandling() {
    console.log('MyAccount - verifyAccountDetailsEmptyFieldsErrorHandling()')

    await this.clearAndBlur(this.inp_firstName)
    await this.assertInnerText(this.lbl_errorFirstName, 'Enter a first name')
    await this.btn_save.isDisabled()
    await this.clearAndBlur(this.inp_lastName)
    await this.assertInnerText(this.lbl_errorLastName, 'Enter a last name')
    await this.btn_save.isDisabled()
    await this.clearAndBlur(this.inp_email)
    await this.assertInnerText(this.lbl_errorEmail, 'Enter an email address')
    await this.btn_save.isDisabled()
    await this.clearAndBlur(this.inp_phoneNumber)
    await this.assertInnerText(this.lbl_errorPhoneNumber, 'Enter a phone number')
    await this.btn_save.isDisabled()

    await this.fillAndAssert(this.inp_firstName, 'Randomfirstname')
    await expect(this.lbl_errorFirstName).toHaveCount(0)
    await this.btn_save.isDisabled()
    await this.fillAndAssert(this.inp_lastName, 'Randomlastname')
    await expect(this.lbl_errorLastName).toHaveCount(0)

    await this.btn_save.isDisabled()
    await this.fillAndAssert(this.inp_email, 'randomemail@mail.com')
    await expect(this.lbl_errorEmail).toHaveCount(0)

    await this.btn_save.isDisabled()
    await this.fillAndAssert(this.inp_phoneNumber, '012312842')
    await expect(this.lbl_errorPhoneNumber).toHaveCount(0)

    await this.btn_save.isEnabled()
  }

  /**
   * Verifies error handling for invalid account details input.
   *
   * This method performs the following steps:
   * - Tests invalid email formats and checks if the correct error message is displayed for each case.
   * - Tests invalid phone number formats and ensures the correct error message is displayed for each case.
   * - Verifies that the 'Save' button is disabled when invalid data is entered and enabled once valid data is provided for all fields only.
   *
   * - Invalid email address formats (e.g., missing '@' symbol, invalid characters).
   * - Invalid phone number formats (e.g., non-numeric characters, incorrect length).
   * - Ensuring the 'Save' button is appropriately enabled or disabled based on input validity.
   */
  async verifyAccountDetailsFieldsErrorHandling() {
    console.log('MyAccount - verifyAccountDetailsFieldsErrorHandling()')

    await this.fillAndAssert(this.inp_email, '123')
    await this.assertInnerText(this.lbl_errorEmail, 'Must contain a valid email address')
    await this.btn_save.isDisabled()
    await this.fillAndAssert(this.inp_email, 'a12s @mail.com')
    await this.assertInnerText(this.lbl_errorEmail, 'Must contain a valid email address')
    await this.btn_save.isDisabled()

    await this.fillAndAssert(this.inp_phoneNumber, 'abc')
    await this.assertInnerText(this.lbl_errorPhoneNumber, 'Phone number is not valid')
    await this.btn_save.isDisabled()
    await this.fillAndAssert(this.inp_phoneNumber, 'abcd123')
    await this.assertInnerText(this.lbl_errorPhoneNumber, 'Phone number is not valid')
    await this.btn_save.isDisabled()

    await this.fillAndAssert(this.inp_email, 'test@mail.com')
    await expect(this.lbl_errorEmail).toHaveCount(0)
    await this.btn_save.isDisabled()

    await this.fillAndAssert(this.inp_phoneNumber, '1234567')
    await expect(this.lbl_errorPhoneNumber).toHaveCount(0)
    await this.btn_save.isEnabled()
  }

    /**
   * Edits the account details in the UI and updates the test context (`ctx`) with the new values.
   *
   * @param param_firstName - New first name to be entered
   * @param param_lastName - New last name to be entered
   * @param param_email - New email address to be entered
   * @param param_phone - New phone number to be entered
   */
  async editAccountDetails(param_firstName: string, param_lastName: string, param_email: string, param_phone: string) {
    console.log('MyAccount - editAccountDetails()')

    this.ctx.user.firstName = param_firstName
    this.ctx.user.lastName = param_lastName
    this.ctx.user.email = param_email
    this.ctx.user.phone = param_phone

    const { firstName, lastName, email, phone } = this.ctx.user

    await this.fillAndAssert(this.inp_firstName, firstName)
    await this.fillAndAssert(this.inp_lastName, lastName)
    await this.fillAndAssert(this.inp_email, email)
    await this.fillAndAssert(this.inp_phoneNumber, phone)
    await this.btn_save.click()
  }
}
