import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class TransactionPage extends BasePage {
  readonly page: Page
  readonly btn_newTransaction: Locator
  readonly btn_pay: Locator
  readonly btn_request: Locator
  readonly inp_searchForUser: Locator
  readonly inp_amount: Locator
  readonly inp_addNote: Locator
  readonly lbl_errorAmount: Locator
  readonly lbl_errorAddNote: Locator
  readonly li_userList: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_newTransaction = page.locator("[data-test='nav-top-new-transaction']")
    this.btn_pay = page.locator("[data-test='transaction-create-submit-payment']")
    this.btn_request = page.locator("[data-test='transaction-create-submit-request']")
    this.inp_searchForUser = page.locator('#user-list-search-input')
    this.inp_amount = page.locator('#amount')
    this.inp_addNote = page.locator('#transaction-create-description-input')
    this.lbl_errorAmount = page.locator("#transaction-create-amount-input-helper-text")
    this.lbl_errorAddNote = page.locator("#transaction-create-description-input-helper-text")
    this.li_userList = page.locator("//ul[@data-test='users-list']")
  }

    /**
   * Navigates to the "Create New Transaction" page by clicking the associated button.
   *
   * This method performs the following actions:
   * - Clicks the "New Transaction" button to start the process of creating a new transaction.
   * - Asserts that the URL changes to indicate successful navigation to the "New Transaction" page.
   *
   * @throws If the URL does not match the expected pattern for the "Create New Transaction" page, the test will fail.
   */
  async clickCreateNewTransaction() {
    console.log('NewTransactionPage - clickCreateNewTransaction()')
    await this.btn_newTransaction.click()
    await expect(this.page).toHaveURL(/.*transaction\/new.*/)
  }

    /**
   * Searches for a user by their username and selects them from the list of results.
   *
   * This method performs the following actions:
   * - Enters the provided username into the user search input field and validates the input value.
   * - Searches the user list for a matching username and clicks the corresponding user entry.
   *
   * @param username - The username of the user to search for.
   *
   * @throws If the specified username is not found in the user list, the method will fail at the selection step.
   */
  async searchForUser(username: string) {
    console.log('NewTransactionPage - searchForUser()')
    await this.fillAndAssert(this.inp_searchForUser, username)
  }

  async clickOnUserAndVerifyDetails(username: string, firstName: String, lastName: string){
    console.log('NewTransactionPage - clickOnUserAndVerifyDetails()')
    await this.li_userList.locator(`//span[text()='${username}']`).click()

    // Verify User Fn and Ln
    const lbl_firstName = this.page.locator(`//h2[text()='${firstName}']`)
    const lbl_lastName = this.page.locator(`//h2[text()='${lastName}']`)
    await expect(lbl_firstName).toBeVisible()
    await expect(lbl_lastName).toBeVisible()
  }

  async verifyActionsAreDisabled() {
    console.log('NewTransactionPage - verifyActionsAreDisabled()')
    await expect(this.btn_request).toBeDisabled()
    await expect(this.btn_pay).toBeDisabled()
  }


  /**
   * Verifies that appropriate error messages are displayed when requiered fields are empty
   * Verifies that the Request and Pay buttons are disabled when fields are empty and enabled only when all fields have valid data.
   */
  async verifyTransactionEmptyFieldsErrorHandling() {
    console.log('NewTransactionPage - verifyTransactionEmptyFieldsErrorHandling()')

    await this.clearAndBlur(this.inp_amount)
    await this.assertInnerText(this.lbl_errorAmount, 'Please enter a valid amount')
    await this.verifyActionsAreDisabled()

    await this.clearAndBlur(this.inp_addNote)
    await this.assertInnerText(this.lbl_errorAddNote, 'Please enter a note')
    await this.verifyActionsAreDisabled()

    await this.inp_amount.fill('5') // Note: use pw fill w/o assertion because regex is requiered so that $[amount] can be verified. Maybe add this part of logic too.
    await expect(this.lbl_errorAmount).toHaveCount(0)
    await this.verifyActionsAreDisabled()

    await this.fillAndAssert(this.inp_addNote, 'Gift')
    await expect(this.lbl_errorAddNote).toHaveCount(0)

    await expect(this.btn_request).toBeEnabled()
    await expect(this.btn_pay).toBeEnabled()
  }
}
