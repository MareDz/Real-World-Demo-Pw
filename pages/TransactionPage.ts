import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'
import { formatCurrency } from '../utils/fnHelpers'

export class TransactionPage extends BasePage {
  readonly page: Page
  readonly btn_newTransaction: Locator
  readonly btn_pay: Locator
  readonly btn_request: Locator
  readonly btn_returnToTransactions: Locator
  readonly btn_createNewTransaction: Locator
  readonly inp_searchForUser: Locator
  readonly inp_amount: Locator
  readonly inp_addNote: Locator
  readonly lbl_errorAmount: Locator
  readonly lbl_errorAddNote: Locator
  readonly lbl_successTransactionTaoastMessage: Locator
  readonly li_userList: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_newTransaction = page.locator("[data-test='nav-top-new-transaction']")
    this.btn_pay = page.locator("[data-test='transaction-create-submit-payment']")
    this.btn_request = page.locator("[data-test='transaction-create-submit-request']")
    this.btn_returnToTransactions = page.locator("[data-test='new-transaction-return-to-transactions']")
    this.btn_createNewTransaction = page.locator("[data-test='new-transaction-create-another-transaction']")
    this.inp_searchForUser = page.locator('#user-list-search-input')
    this.inp_amount = page.locator('#amount')
    this.inp_addNote = page.locator('#transaction-create-description-input')
    this.lbl_errorAmount = page.locator('#transaction-create-amount-input-helper-text')
    this.lbl_errorAddNote = page.locator('#transaction-create-description-input-helper-text')
    this.lbl_successTransactionTaoastMessage = page.locator("[data-test='alert-bar-success']")
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
   *   */
  async searchForUser(username: string) {
    console.log('NewTransactionPage - searchForUser()')
    await this.fillAndAssert(this.inp_searchForUser, username)
  }

  /**
   * Verify that 0 results are displayed in user list
   * Fixed w8 is here just to make sure that test is not flaky, we're running code on Local and Pw is blazing fast.
   *        Because of this FE can't response that fast when filtering table
   */
  async verifyNoUsersFound() {
    console.log('NewTransactionPage - verifyNoUsersFound()')
    const li_userElement = this.li_userList.locator('//li')
    await expect(li_userElement).toHaveCount(0, { timeout: 10000 })
  }

  /**
   * Clicks on a user from the user list by username
   * @param username - The username used to locate and click the user in the list.
   */
  async clickOnUser(username: string) {
    console.log('NewTransactionPage - clickOnUser()')
    await this.li_userList.locator(`//span[text()='${username}']`).click()
  }

  /**
   * Verifies that the correct first name and last name are displayed.
   * @param firstName - The expected first name to be shown in the user detail view.
   * @param lastName - The expected last name to be shown in the user detail view.
   */
  async verifyTargetUserCredentials(firstName: String, lastName: string) {
    console.log('NewTransactionPage - verifyTargetUserCredentials()')

    const lbl_firstName = this.page.locator(`//h2[text()='${firstName}']`)
    const lbl_lastName = this.page.locator(`//h2[text()='${lastName}']`)
    await expect(lbl_firstName).toBeVisible()
    await expect(lbl_lastName).toBeVisible()
  }

  /**
   * Verifies that the "Request" and "Pay" buttons are disabled.
   */
  async verifyActionsAreDisabled() {
    console.log('NewTransactionPage - verifyActionsAreDisabled()')
    await expect(this.btn_request).toBeDisabled()
    await expect(this.btn_pay).toBeDisabled()
  }

  /**
   * Verifies error handling and button states when required transaction fields are empty or invalid.
   *
   * - Checks that appropriate error messages are shown for the amount and note fields when left empty.
   * - Ensures that the "Request" and "Pay" buttons remain disabled until all required fields are filled with valid data.
   * - Verifies that once valid input is provided (e.g., a numeric amount and note), errors disappear and actions become enabled.
   *
   * Note: Uses `.fill()` on the amount field without assertion because the UI includes a currency format (e.g., "$[amount]").
   */
  async verifyTransactionEmptyFieldsErrorHandling() {
    console.log('NewTransactionPage - verifyTransactionEmptyFieldsErrorHandling()')

    await this.clearAndBlur(this.inp_amount)
    await this.assertInnerText(this.lbl_errorAmount, 'Please enter a valid amount')
    await this.verifyActionsAreDisabled()

    await this.clearAndBlur(this.inp_addNote)
    await this.assertInnerText(this.lbl_errorAddNote, 'Please enter a note')
    await this.verifyActionsAreDisabled()

    await this.inp_amount.fill('5')
    await expect(this.lbl_errorAmount).toHaveCount(0)
    await this.verifyActionsAreDisabled()

    await this.fillAndAssert(this.inp_addNote, 'Gift')
    await expect(this.lbl_errorAddNote).toHaveCount(0)

    await expect(this.btn_request).toBeEnabled()
    await expect(this.btn_pay).toBeEnabled()
  }

  /**
   * Fills in the transaction amount and optionally a note for a new transaction.
   *
   * - Enters the provided `amount` into the transaction amount input field.
   * - Reads the formatted amount from the input, removes formatting symbols (like "$", commas, ".00"),
   *   and parses it into a number.
   * - Logs the cleaned numeric value of the transaction amount.
   * - Stores the cleaned numeric value in the test context (`ctx.bank.transactionAmmount`) for later use.
   * - If a `note` is provided:
   *   - Fills the note input field.
   *   - Asserts that the note field contains the expected value.
   *   - Logs the note value.
   *
   * This helps ensure that both amount and optional note inputs are correctly filled
   * and stored in a consistent, clean format for further validation or processing.
   *
   * @param amount - The amount to be entered in the transaction form, as a string (e.g., "1,234").
   * @param note - (Optional) A short text note to include with the transaction.
   */
  async fillUpAmmountAndAddNote(amount: number, note?: string) {
    console.log('NewTransactionPage - fillUpAmmountAndAddNote()')

    await this.inp_amount.fill(String(amount))
    const amountValue = await this.inp_amount.inputValue()
    const cleanedString = amountValue.replace('$', '').replace('.00', '')
    const transactionAmmountFormated = parseInt(cleanedString.replace(/,/g, ''), 10)

    this.ctx.bank.transactionAmmount = transactionAmmountFormated
    console.log(`Transaction Amount is: ${transactionAmmountFormated}`)

    if (note) {
      await this.inp_addNote.fill(note)
      await this.fillAndAssert(this.inp_addNote, note)
      console.log(`Transaction Note is: ${note}`)
    }
  }

  /**
   * Submits a transaction of the specified type (`'Pay'` or `'Request'`) and verifies success.
   *
   * - Clicks the appropriate transaction button based on the `transactionType`.
   * - Asserts that a success toast message is displayed after submission.
   *
   * @param transactionType - The type of transaction to perform: `'Pay'` or `'Request'`.
   */
  async completeTransaction(transactionType: 'Request' | 'Pay') {
    console.log('NewTransactionPage - completeTransaction()')

    const button = transactionType === 'Request' ? this.btn_request : this.btn_pay
    await button.click()

    await this.assertInnerText(this.lbl_successTransactionTaoastMessage, 'Transaction Submitted!')
  }

  /**
   * Verifies the transaction confirmation message shown to the user.
   *
   * Example expected format:
   *   - "Paid $1,000.00 for Lunch"
   *   - "Requested $250.00 for Groceries"
   *
   * This method strictly checks that the full message matches the expected action,
   * amount, and note.
   *
   * @param action - The transaction type, either "Paid" or "Requested".
   * @param amount - The numeric transaction amount.
   * @param note - The note associated with the transaction.
   */
  async verifyTransactionMessage(action: 'Paid' | 'Requested', amount: number, note: string) {
    console.log('NewTransactionPage - verifyTransactionMessage()')

    const formattedAmount = formatCurrency(amount)

    const locator = this.page.locator("//main[@data-test='main']//h2").last()
    const actualText = await locator.innerText()

    const expectedText = `${action} ${formattedAmount} for ${note}`
    expect(actualText).toBe(expectedText)
  }

  async clickReturnOnTransactions() {
    console.log('NewTransactionPage - clickReturnOnTransactions()')
    await this.btn_returnToTransactions.click()
  }

  async clickCreateAnotherTransaction() {
    console.log('NewTransactionPage - clickCreateAnotherTransaction()')
    await this.btn_createNewTransaction.click()
    await expect(this.page).toHaveURL(/.*transaction\/new.*/)
  }
}
