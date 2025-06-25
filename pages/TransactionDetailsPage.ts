import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class TransactionDetailsPage extends BasePage {
  readonly btn_like: Locator
  readonly btn_acceptRequest: Locator
  readonly btn_rejectRequest: Locator
  readonly inp_comment: Locator
  readonly lbl_transactionDetailsHeader: Locator
  readonly lbl_transactionDescription: Locator
  readonly lbl_comment: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.btn_like = page.locator("[data-test^='transaction-like-button']")
    this.btn_acceptRequest = page.locator("[data-test^='transaction-accept-request']")
    this.btn_rejectRequest = page.locator("[data-test^='transaction-reject-request']")
    this.inp_comment = page.locator("[data-test^='transaction-comment-input']")
    this.lbl_transactionDetailsHeader = page.locator("[data-test='transaction-detail-header']")
    this.lbl_transactionDescription = page.locator("[data-test='transaction-description']")
    this.lbl_comment = page.locator("[data-test^='comment-list-item']")
  }

  /**
   * Verifies the details of a transaction shown on the Transaction Details page.
   *
   * This method performs a series of assertions to ensure that the UI accurately reflects
   * the expected state of a transaction after it has been submitted. It checks for:
   * - The correct sender and receiver full names.
   * - The expected transaction note.
   * - The number of likes and comments.
   * - The transaction amount, properly formatted and matched.
   * - The transaction type (`'paid'` or `'requested'`).
   * - The visibility of request-specific buttons (`Accept` and `Reject`) if applicable.
   *
   * Additional UI assertions include:
   * - The page header is visible and correct.
   * - Navigation tabs are not present on the details page.
   * - Like button is enabled and the comment input is visible.
   *
   * @param sender - The full name of the user who initiated the transaction.
   * @param receiver - The full name of the user who received the transaction.
   * @param note - The note or message attached to the transaction.
   * @param expectedTransactionAmount - The amount involved in the transaction, as a string (e.g. "-20").
   * @param numberOfLikes - Expected number of likes on the transaction.
   * @param numbeOfComments - Expected number of comments on the transaction.
   * @param createdTransaction - The type of transaction: `'paid'` or `'requested'`.
   */
  async verifyTransactionDetails(sender: string, receiver: string, note: string, expectedTransactionAmount: string, numberOfLikes: number, numbeOfComments: number, createdTransaction: 'paid' | 'requested') {
    console.log('TransactionDetailsPage - verifyTransactionDetails()')

    await this.assertInnerText(this.lbl_transactionDetailsHeader, 'Transaction Detail')
    await expect(this.lbl_transactionNavigationTabs).toHaveCount(0)

    await expect(this.btn_like).toBeEnabled()
    await expect(this.inp_comment).toBeVisible()

    const senderFullName = await this.lbl_transactionSender.last().innerText()
    const receiverFullName = await this.lbl_transactionReceiver.last().innerText()
    const likeCount = Number(await this.lbl_likeCount.innerText())
    const transactionType = await this.lbl_transactionType.innerText()
    const numbeOfCommentsInList = await this.lbl_comment.count()
    const transactionNote = await this.lbl_transactionDescription.innerText()

    const amountText = await this.lbl_transactionAmount.first().textContent()
    const formatedDisplayedTransactionAmount = parseFloat(amountText?.replace(/[^0-9.-]+/g, '') || '0')
    console.log('Extracted Tansaction Amount:', formatedDisplayedTransactionAmount)

    expect(parseFloat(expectedTransactionAmount)).toBe(formatedDisplayedTransactionAmount)
    expect(sender).toBe(senderFullName)
    expect(receiver).toBe(receiverFullName)
    expect(numberOfLikes).toBe(likeCount)
    expect(note).toBe(transactionNote)
    expect(numbeOfComments).toBe(numbeOfCommentsInList)
    expect(createdTransaction).toBe(transactionType.trim())

    if (createdTransaction === 'requested') {
      await expect(this.btn_acceptRequest).toBeVisible()
      await expect(this.btn_rejectRequest).toBeVisible()
    } else {
      await expect(this.btn_acceptRequest).toHaveCount(0)
      await expect(this.btn_rejectRequest).toHaveCount(0)
    }
  }

  /**
   * Clicks the "Accept Request" button on the Transaction Details page and verifies that
   * both the "Accept" and "Reject" buttons are no longer visible afterward.
   */
  async clickAcceptRequest() {
    console.log('TransactionDetailsPage - clickAcceptRequest()')
    await this.btn_acceptRequest.click()
    await expect(this.btn_acceptRequest).toHaveCount(0)
    await expect(this.btn_rejectRequest).toHaveCount(0)
  }

  /**
   * Clicks the "Reject Request" button on the Transaction Details page and verifies that
   * both the "Accept" and "Reject" buttons are no longer visible afterward.
   */
  async clickRejectRequest() {
    console.log('TransactionDetailsPage - clickRejectRequest()')
    await this.btn_rejectRequest.click()
    await expect(this.btn_acceptRequest).toHaveCount(0)
    await expect(this.btn_rejectRequest).toHaveCount(0)
  }
}
