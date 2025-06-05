import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class OnboardingPage extends BasePage {
  readonly page: Page
  readonly btn_onboardingNext: Locator
  readonly lbl_onboardingTitle: Locator
  readonly lbl_onboardingTextContent: Locator
  readonly lbl_currentUser: Locator
  readonly lbl_currentUserUsername: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_onboardingNext = page.locator("[data-test='user-onboarding-next']")
    this.lbl_onboardingTitle = page.locator("[data-test='user-onboarding-dialog-title']")
    this.lbl_onboardingTextContent = page.locator("[data-test='user-onboarding-dialog-content'] p")
    this.lbl_currentUser = page.locator("[data-test='sidenav-user-full-name']")
    this.lbl_currentUserUsername = page.locator("[data-test='sidenav-username']")
  }

  /**
   * Asserts that the onboarding title matches the expected text: "Get Started with Real World App".
   * Retrieves and normalizes the inner text of the onboarding content to remove excess whitespace.
   * Verifies that the content includes the expected guidance message for setting up a bank account.
   */
  async verifyGetStartedIsDisplayed() {
    console.log('OnboardingPage - verifyGetStartedIsDisplayed()')
    await this.assertInnerText(this.lbl_onboardingTitle, 'Get Started with Real World App')

    const elementInnerText = await this.lbl_onboardingTextContent.innerText()
    const cleanedInnerText = elementInnerText.replace(/\s+/g, ' ')
    expect(cleanedInnerText).toContain('Real World App requires a Bank Account to perform transactions. Click Next to begin setup of your Bank Account.')
  }

  /**
   * Clicks the "Next" button to proceed from the "Get Started" step.
   * Waits explicitly for the "Create Bank Account" heading to appear using an XPath selector:
   *     - This is necessary to ensure the new screen has fully rendered before proceeding.
   *     - Using `waitFor()` on a specific element is a reliable and readable approach in UI testing,
   *     - especially when transitioning between screens that may take time to load or when 1 locator is used on both screens A and B when you are moving from A to B
   * Asserts that the onboarding title matches the expected text: "Create Bank Account".
   */
  async clickNextGetStartedAndVerifyCreateBankAccountDisplayed() {
    console.log('OnboardingPage - clickNextGetStartedAndVerifyCreateBankAccountDisplayed()')

    await this.btn_onboardingNext.click()
    await this.page.locator("//h2[text()='Create Bank Account']").waitFor() // TODO: Explain why use this line and why is it reasonable concept
    await this.assertInnerText(this.lbl_onboardingTitle, 'Create Bank Account')
  }

  /**
   * Fills out the "Create Bank Account" form with the provided details and submits it.
   * Saves the bank account data (bank name, routing number, and account number) into the test context for later use or verification.
   * Uses `fillAndAssert()` to enter values into the form fields and verify that the inputs were set correctly.
   * Clicks the "Save" button to submit the bank account form.
   */ 
  async completeBankAccountForm(bankName: string, routingNumber: string, accountNumber: string) {
    console.log('OnboardingPage - completeBankAccountForm()')

    this.ctx.bank.bankName = bankName
    this.ctx.bank.routingNumber = routingNumber
    this.ctx.bank.accountNumber = accountNumber

    await this.fillAndAssert(this.inp_bankName, bankName)
    await this.fillAndAssert(this.inp_routingNumber, routingNumber)
    await this.fillAndAssert(this.inp_accountNumber, accountNumber)
    await this.btn_saveBankAccount.click()
  }

/**
 * Waits explicitly for the "Finished" heading to appear using an XPath selector:
 *   - This ensures the final screen has fully loaded before assertions run.
 *   - Using `waitFor()` on a specific, unique element is a reliable way to detect screen transitions,
 *   - especially useful when navigating from one view to another or when similar locators exist on multiple screens.
 * Asserts that the onboarding title matches the expected text: "Finished".
 * Retrieves and normalizes the content text by removing extra whitespace, then verifies that it includes the expected welcome message.
 */
  async verifyFinishedScreenDisplayed() {
    console.log('OnboardingPage - verifyFinishedScreenDisplayed()')

    await this.page.locator("//h2[text()='Finished']").waitFor() // TODO: Explain why use this line and why is it reasonable concept
    await this.assertInnerText(this.lbl_onboardingTitle, 'Finished')

    const elementInnerText = await this.lbl_onboardingTextContent.innerText()
    const cleanedInnerText = elementInnerText.replace(/\s+/g, ' ')
    expect(cleanedInnerText).toContain("You're all set! We're excited to have you aboard the Real World App!")
  }

  /**
 * Clicks the "Next" button to finish onboarding and transition to the main app view.
 * Retrieves the full name and username shown in the UI.
 * Removes the leading "@" character from the username label for comparison.
 * Asserts that:
 *   - The full name matches the expected format: first name + first initial of last name.
 *   - The username matches the one stored in the test context (`ctx.user.username`).
 */
  async clickDoneAndVerifyUserCredentials() {
    console.log('OnboardingPage - clickDoneAndVerifyUserCredentials()')

    await this.btn_onboardingNext.click()

    const userFullName = await this.lbl_currentUser.innerText()
    const userUsername = (await this.lbl_currentUserUsername.innerText()).slice(1)

    expect(userFullName).toBe(this.ctx.user.firstName + ' ' + this.ctx.user.lastName?.charAt(0))
    expect(userUsername).toBe(this.ctx.user.username)
  }
}
