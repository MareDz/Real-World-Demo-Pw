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
   * Adds a new bank account by filling out the form with dynamically generated data and saving it.
   *
   * - Generates a unique `bankName` by combining the current timestamp with a random bank name to avoid duplicates.
   * - Retrieves random `accountNumber` and `routingNumber` using helper functions.
   * - Stores all generated values in the shared context (`this.ctx.bank`) for future reference or assertions.
   * - Fills each input field using `fillAndAssert()` to ensure data is entered correctly.
   * - Submits the form by clicking the "Save" button.
   * 
   * Testing of this app is atm performing in local environments and PW scripts are too fast. Application can't handle this ammount of new objects created.
   * Because of that, fixed wait is added so that whole screen can be rendered in situations when system is bottlenecking.
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
    await this.page.waitForTimeout(3000)
  }

  /**
   * Deletes all bank accounts in the list and verifies that they are marked as "Deleted".
   *
   * This method interacts with the "Delete" buttons for each bank account in the list, clicking on each to remove
   * the corresponding bank account. After each delete action, it checks that the bank account is successfully removed
   * from the list and marked as "Deleted" in the UI.
   *
   * - Counts the number of "Delete" buttons present for the bank accounts.
   * - Iterates through each delete button and clicks it to delete the bank account.
   * - After deleting the accounts, checks that each bank account is marked as "Deleted" in the list.
   */
  async deleteAllBankAccount() {
    console.log('BankAccountPage - deleteAllBankAccount()')
    await this.lbl_bankAccounts.isVisible({ timeout: 30000 })

    const numberOfDeleteButtons = await this.btn_deleteBankAccount.count()
    console.log(`Number of displayed delete buttons are :  ${numberOfDeleteButtons}`)

    for (let i = 0; i < numberOfDeleteButtons; i++) {
      console.log(`Deleting button no.${i+1}`)
      await this.page.waitForTimeout(2500)
      await this.btn_deleteBankAccount.first().click()
    }

    const bankAccountInList = this.li_bankAccounts.locator(`//p`)
    for (let i = 0; i < numberOfDeleteButtons; i++) {
      await this.page.waitForTimeout(2500)
      await this.assertInnerTextContain(bankAccountInList.first(), 'Deleted')
    }

    await expect(this.btn_deleteBankAccount).toHaveCount(0)
  }
}
