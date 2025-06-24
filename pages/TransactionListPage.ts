import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class TransactionListPage extends BasePage {
  readonly page: Page
  readonly btn_everyoneTab: Locator
  readonly btn_friendsTab: Locator
  readonly btn_mineTab: Locator
  readonly btn_transactionItem: Locator
  readonly lbl_tabTitle: Locator
  readonly lbl_commentCount: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_everyoneTab = page.locator("[data-test='nav-public-tab']")
    this.btn_friendsTab = page.locator("[data-test='nav-contacts-tab']")
    this.btn_mineTab = page.locator("[data-test='nav-personal-tab']")
    this.btn_transactionItem = page.locator("[data-test^='transaction-item']")
    this.lbl_tabTitle = page.locator("//div[@data-test='transaction-list']/parent::div")
    this.lbl_commentCount = page.locator("[data-test='transaction-comment-count']").first()
  }

  /**
   * Verifies that the currently active transaction tab is correctly selected based on the provided name.
   *
   * This method checks the `aria-selected="true"` attribute of the tab element to determine if it's active.
   * Tabs can be:
   * - 'Everyone'
   * - 'Friends'
   * - 'Mine'
   *
   * @param tab - The name of the tab to verify as active. Must be one of: 'Everyone' | 'Friends' | 'Mine'.
   * @throws If the tab name is not recognized, it throws an error to prevent silent test failures.
   */
  async verifyActiveTab(tab: 'Everyone' | 'Friends' | 'Mine') {
    console.log('TransactionListPage - verifyActiveTab()')

    switch (tab) {
      case 'Everyone':
        await expect(this.btn_everyoneTab).toHaveAttribute('aria-selected', 'true')
        break
      case 'Friends':
        await expect(this.btn_friendsTab).toHaveAttribute('aria-selected', 'true')
        break
      case 'Mine':
        await expect(this.btn_mineTab).toHaveAttribute('aria-selected', 'true')
        break
      default:
        throw new Error('Invalid tab')
    }
  }

  /**
   * Navigates to the selected transaction tab: 'Everyone', 'Friends', or 'Mine'.
   *
   * - Clicks on the corresponding tab button based on the `tab` argument.
   * - Verifies that the tab is marked as active.
   * - Confirms that the correct title is visible within the transaction list container.
   *
   * Locator chaining is used to scope tab title verification:
   * - `this.lbl_tabTitle` identifies the container of the active transaction list section.
   * - `.locator("//div[text()='...']")` is chained to it to locate the specific title (`'Public'`, `'Contacts'`, or `'Personal'`).
   *   This ensures that the element is found within the correct parent, improving test precision and reducing the risk
   *   of false positives from similar elements elsewhere in the DOM.
   *
   * @param tab - The tab to navigate to. Accepted values are `'Everyone'`, `'Friends'`, or `'Mine'`.
   * @throws If an invalid tab name is passed or the expected tab title is not visible.
   */
  async goToTab(tab: 'Everyone' | 'Friends' | 'Mine') {
    console.log('TransactionListPage - goToTab()')

    switch (tab) {
      case 'Everyone':
        await this.btn_everyoneTab.click()
        await this.verifyActiveTab('Everyone')
        await expect(this.lbl_tabTitle.locator("//div[text()='Public']")).toBeVisible()
        break
      case 'Friends':
        await this.btn_friendsTab.click()
        await this.verifyActiveTab('Friends')
        await expect(this.lbl_tabTitle.locator("//div[text()='Contacts']")).toBeVisible()
        break
      case 'Mine':
        await this.btn_mineTab.click()
        await this.verifyActiveTab('Mine')
        await expect(this.lbl_tabTitle.locator("//div[text()='Personal']")).toBeVisible()
        break
      default:
        throw new Error('Invalid tab')
    }
  }

  /**
   * Verifies the details of the most recent transaction in the "Mine" tab.
   *
   * - Extracts the displayed transaction amount and compares it to the expected value.
   * - Asserts that the sender's and receiver's full names match the provided parameters.
   * - Verifies that the transaction note is visible and correctly rendered.
   * - Asserts the correct number of likes and comments are shown.
   *
   * @param sender - The expected full name of the transaction sender.
   * @param receiver - The expected full name of the transaction receiver.
   * @param note - The note attached to the transaction (used to locate the note element).
   * @param expectedTransactionAmount - The expected transaction amount as a string (e.g. "-20").
   * @param numberOfLikes - The expected number of likes on the transaction.
   * @param numerOfComments - The expected number of comments on the transaction.
   *
   * @throws Will throw if any of the displayed values do not match the expected ones.
   */
  async verifyMineLastTransaction(sender: string, receiver: string, note: string, expectedTransactionAmount: string, numberOfLikes: number, numerOfComments: number, createdTransaction: 'paid' | 'received') {
    console.log('TransactionListPage - verifyMineLastTransaction()')

    const senderFullName = await this.lbl_transactionSender.first().innerText()
    const receiverFullName = await this.lbl_transactionReceiver.first().innerText()
    const likeCount = Number(await this.lbl_likeCount.first().innerText())
    const commentCount = Number(await this.lbl_commentCount.innerText())
    const transactionType = await this.lbl_transactionType.first().innerText()
    const transactionNote = this.page.locator(`//p[text()='${note}']`)

    const amountText = await this.lbl_transactionAmount.first().textContent()
    const formatedDisplayedTransactionAmount = parseFloat(amountText?.replace(/[^0-9.-]+/g, '') || '0')
    console.log('Extracted Tansaction Amount:', formatedDisplayedTransactionAmount)

    expect(parseFloat(expectedTransactionAmount)).toBe(formatedDisplayedTransactionAmount)
    expect(sender).toBe(senderFullName)
    expect(receiver).toBe(receiverFullName)
    expect(numberOfLikes).toBe(likeCount)
    expect(numerOfComments).toBe(commentCount)
    expect(createdTransaction).toBe(transactionType.trim())
    expect(transactionNote).toBeVisible()
  }

  /**
   * Clicks on the most recent transaction listed in the transaction feed.
   *
   */
  async clickOnLastTransaction() {
    console.log('TransactionListPage - clickOnLastTransaction()')
    await this.btn_transactionItem.first().click()
  }
}
