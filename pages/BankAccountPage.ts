import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'
import { getBankName, getAccountNumber, getRoutingNumber, getCurrentDateTimeAsNumbers } from '../utils/fnHelpers'

export class BankAccountPage extends BasePage {
  readonly page: Page
  readonly btn_createNewBankAccount: Locator
  readonly btn_deleteBankAccount: Locator
  readonly lbl_createBankAccount: Locator
  readonly lbl_bankAccounts: Locator
  readonly li_bankAccounts: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_createNewBankAccount = page.locator("[data-test='bankaccount-new']")
    this.btn_deleteBankAccount = page.locator("//button[@data-test='bankaccount-delete']")
    this.lbl_createBankAccount = page.locator("//h2[text()='Create Bank Account']") // TODO: ID
    this.lbl_bankAccounts = page.locator("//h2[text()='Create Bank Accounts']")
    this.li_bankAccounts = page.locator("//ul[@data-test='bankaccount-list']")
  }

/**
 * Verifies that the most recently added bank account is correctly displayed in the list.
 * 
 * Since new bank accounts are appended to the end of the list, this method targets the last
 * element and checks if its text matches the expected bank name from the test context.
 * 
 * Useful in cases where we want to confirm that a newly created account has been successfully added
 * without relying on the full list structure or order of existing accounts.
 */
  async verifyBankAccountDisplayed() {
    console.log("BankAccountPage - verifyBankAccountDisplayed()")

    const lbl_recendAddedBankAccount = this.li_bankAccounts.locator("//li//p").last()
    await this.assertInnerText(lbl_recendAddedBankAccount, String(this.ctx.bank.bankName))
  }

  /**
   * Clicks on the "Create New Bank Account" button.
   * Waits for the bank account creation page to load.
   * Verifies that the page contains the expected label or heading ("Create Bank Account").
   */
  // TODO: Explain better
  async clickCreateNewBankAccount() {
    console.log('BankAccountPage - clickCreateNewBankAccount()')
    await this.btn_createNewBankAccount.click()
    await this.assertTitleAndUrl('Cypress Real World App', 'bankaccounts/new')
    await this.assertInnerText(this.lbl_createBankAccount, 'Create Bank Account')
  }

   /**
   * Generates random bank details (bank name, account number, and routing number).
   * Updates the test context with the generated bank details.
   * Fills out the bank account form with the generated data.
   * Submits the form by clicking the "Save" button.
   */
  async addNewBankAccount() {
    console.log('BankAccountPage - addNewBankAccount()')

    const bankName = `${getCurrentDateTimeAsNumbers()}${getBankName()}`
    const accountNumber = getAccountNumber()
    const routingNumber = getRoutingNumber()

    this.ctx.bank.bankName = bankName
    this.ctx.bank.accountNumber = accountNumber
    this.ctx.bank.routingNumber = routingNumber

    await this.fillAndAssert(this.inp_bankName, bankName)
    await this.fillAndAssert(this.inp_routingNumber, routingNumber)
    await this.fillAndAssert(this.inp_accountNumber, accountNumber)

    await this.btn_saveBankAccount.click()
  }
}
