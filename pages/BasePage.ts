import { Locator, Page, expect } from '@playwright/test'
import { Base } from './Base'
import { UserData } from '../state/UserModel'

export class BasePage extends Base {
  readonly page: Page
  readonly btn_saveBankAccount: Locator
  readonly inp_username: Locator
  readonly inp_password: Locator
  readonly inp_firstName: Locator
  readonly inp_lastName: Locator
  readonly inp_bankName: Locator
  readonly inp_routingNumber: Locator
  readonly inp_accountNumber: Locator
  readonly lbl_erroBankName: Locator
  readonly lbl_errorRoutingNumber: Locator
  readonly lbl_errorAccountNumber: Locator
  readonly lbl_errorUsername: Locator
  readonly lbl_errorPassowrd: Locator
  readonly lbl_currentUser: Locator
  readonly lbl_currentUserUsername: Locator
  readonly lbl_transactionAmount: Locator
  readonly lbl_transactionSender: Locator
  readonly lbl_transactionReceiver: Locator
  readonly lbl_transactionType: Locator
  readonly lbl_likeCount: Locator
  readonly lbl_transactionNavigationTabs: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_saveBankAccount = page.locator("[data-test='bankaccount-submit']")
    this.lbl_erroBankName = page.locator('#bankaccount-bankName-input-helper-text')
    this.inp_bankName = page.locator('#bankaccount-bankName-input')
    this.inp_routingNumber = page.locator('#bankaccount-routingNumber-input')
    this.inp_accountNumber = page.locator('#bankaccount-accountNumber-input')
    this.lbl_errorRoutingNumber = page.locator('#bankaccount-routingNumber-input-helper-text')
    this.lbl_errorAccountNumber = page.locator('#bankaccount-accountNumber-input-helper-text')
    this.inp_username = page.locator('#username')
    this.inp_password = page.locator('#password')
    this.inp_firstName = page.locator("[name='firstName']")
    this.inp_lastName = page.locator("[name='lastName']")
    this.lbl_errorUsername = page.locator('#username-helper-text')
    this.lbl_errorPassowrd = page.locator('#password-helper-text')
    this.lbl_currentUser = page.locator("[data-test='sidenav-user-full-name']")
    this.lbl_currentUserUsername = page.locator("[data-test='sidenav-username']")
    this.lbl_transactionAmount = page.locator('.TransactionAmount-amountNegative')
    this.lbl_transactionSender = page.locator("[data-test^='transaction-sender']")
    this.lbl_transactionReceiver = page.locator("[data-test^='transaction-receiver']")
    this.lbl_transactionType = page.locator("[data-test^='transaction-action']")
    this.lbl_likeCount = page.locator("[data-test^='transaction-like-count']")
    this.lbl_transactionNavigationTabs = page.locator("[data-test='nav-transaction-tabs']")
  }

  /**
   * Verifies validation and button state behavior on the "Create Bank Account" form when fields are empty or invalid.
   *
   * - Checks that error messages are displayed for empty or incorrectly filled fields (bank name, routing number, account number).
   * - Ensures the "Save" button remains disabled until all fields are filled with valid input.
   * - Validates that error messages disappear once valid data is entered.
   * - Confirms the "Save" button is enabled only after all inputs are correctly filled.
   */
  async verifyBankAccountEmptyFieldErrorHandling() {
    console.log('BasePage - verifyBankAccountEmptyFieldErrorHandling()')

    await this.clearAndBlur(this.inp_bankName)
    await this.assertInnerText(this.lbl_erroBankName, 'Enter a bank name')
    await this.btn_saveBankAccount.isDisabled()

    await this.clearAndBlur(this.inp_routingNumber)
    await this.assertInnerText(this.lbl_errorRoutingNumber, 'Enter a valid bank routing number')
    await this.btn_saveBankAccount.isDisabled()

    await this.clearAndBlur(this.inp_accountNumber)
    await this.assertInnerText(this.lbl_errorAccountNumber, 'Enter a valid bank account number')
    await this.btn_saveBankAccount.isDisabled()

    await this.fillAndAssert(this.inp_bankName, 'ABCDEF')
    await this.btn_saveBankAccount.isDisabled()
    await expect(this.lbl_erroBankName).toHaveCount(0)

    await this.fillAndAssert(this.inp_routingNumber, '123456789')
    await this.btn_saveBankAccount.isDisabled()
    await expect(this.lbl_errorRoutingNumber).toHaveCount(0)

    await this.fillAndAssert(this.inp_accountNumber, '12345678901')
    await expect(this.lbl_errorAccountNumber).toHaveCount(0)

    await this.btn_saveBankAccount.isEnabled()
  }

  /**
   * Verifies error validation messages and "Save" button state for invalid inputs
   * on the "Create Bank Account" form.
   *
   * - Ensures that appropriate validation errors are shown when:
   *   - Bank name is too short
   *   - Routing number is not exactly 9 digits
   *   - Account number is too short or too long
   * - Verifies that the "Save" button remains disabled while inputs are invalid.
   * - Confirms that valid inputs remove error messages and enable the "Save" button.
   *
   * BUG - number of maximum characters is not set for 'Bank Name' input
   * BUG - fields accepts empty string
   */

  async verifyBankAccountInvalidInputErrors() {
    console.log('BasePage - verifyBankAccountInvalidInputErrors()')

    await this.fillAndAssert(this.inp_bankName, 'ABC')
    await this.assertInnerText(this.lbl_erroBankName, 'Must contain at least 5 characters')
    await this.btn_saveBankAccount.isDisabled()
    await this.fillAndAssert(this.inp_bankName, 'ABCDE')
    await expect(this.lbl_erroBankName).toHaveCount(0)
    await this.btn_saveBankAccount.isDisabled()

    await this.fillAndAssert(this.inp_routingNumber, '12345678')
    await this.assertInnerText(this.lbl_errorRoutingNumber, 'Must contain a valid routing number')
    await this.btn_saveBankAccount.isDisabled()
    await this.fillAndAssert(this.inp_routingNumber, '12345678')
    await this.assertInnerText(this.lbl_errorRoutingNumber, 'Must contain a valid routing number')
    await this.btn_saveBankAccount.isDisabled()
    await this.fillAndAssert(this.inp_routingNumber, '123456789')
    await expect(this.lbl_errorRoutingNumber).toHaveCount(0)
    await this.btn_saveBankAccount.isDisabled()

    await this.fillAndAssert(this.inp_accountNumber, '12345678')
    await this.assertInnerText(this.lbl_errorAccountNumber, 'Must contain at least 9 digits')
    await this.btn_saveBankAccount.isDisabled()

    await this.fillAndAssert(this.inp_accountNumber, '1234567890123')
    await this.assertInnerText(this.lbl_errorAccountNumber, 'Must contain no more than 12 digits')
    await this.btn_saveBankAccount.isDisabled()

    await this.fillAndAssert(this.inp_accountNumber, '123456789')
    await expect(this.lbl_errorAccountNumber).toHaveCount(0)
    await this.btn_saveBankAccount.isEnabled()
    await this.fillAndAssert(this.inp_accountNumber, '1234567890')
    await expect(this.lbl_errorAccountNumber).toHaveCount(0)
    await this.btn_saveBankAccount.isEnabled()
    await this.fillAndAssert(this.inp_accountNumber, '12345678901')
    await expect(this.lbl_errorAccountNumber).toHaveCount(0)
    await this.btn_saveBankAccount.isEnabled()
    await this.fillAndAssert(this.inp_accountNumber, '123456789012')
    await expect(this.lbl_errorAccountNumber).toHaveCount(0)
    await this.btn_saveBankAccount.isEnabled()
  }
}
