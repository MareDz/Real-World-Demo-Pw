import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class TransactionDetailsPage extends BasePage {
  readonly btn_like: Locator
  readonly inp_comment: Locator
  readonly lbl_transactionDetailsHeader: Locator
  readonly lbl_transactionDescription: Locator
  readonly lbl_comment: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.btn_like = page.locator("[data-test^='transaction-like-button']")
    this.inp_comment = page.locator("[data-test^='transaction-comment-input']")
    this.lbl_transactionDetailsHeader = page.locator("[data-test='transaction-detail-header']")
    this.lbl_transactionDescription = page.locator("[data-test='transaction-description']")
    this.lbl_comment = page.locator("[data-test^='comment-list-item']")
  }

  /**
   * Verifies all critical details of a transaction on the Transaction Details page.
   *
   * - Ensures the transaction detail header is present and that navigation tabs are not displayed.
   * - Verifies the UI elements (like button and comment input) are correctly rendered.
   * - Extracts and compares the displayed sender and receiver names with expected values.
   * - Parses the transaction amount from the DOM and compares it with the expected value.
   * - Verifies the number of likes and comments shown.
   * - Checks that the transaction note matches the expected string.
   * - Confirms the transaction type ('paid' or 'received') matches the expected value after trimming whitespace.
   *
   * @param sender - Expected full name of the transaction sender.
   * @param receiver - Expected full name of the transaction receiver.
   * @param note - Expected note text associated with the transaction.
   * @param expectedTransactionAmount - The expected monetary value shown in the transaction.
   * @param numberOfLikes - The expected number of likes on the transaction.
   * @param numbeOfComments - The expected number of user comments.
   * @param createdTransaction - Specifies if the transaction was 'paid' or 'received'.
   */
  async verifyTransactionDetails(sender: string, receiver: string, note: string, expectedTransactionAmount: string, numberOfLikes: number, numbeOfComments: number, createdTransaction: 'paid' | 'received') {
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
  }
}
