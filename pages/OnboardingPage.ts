import { APIRequestContext, Locator, Page, expect } from '@playwright/test'
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

  async verifyGetStartedIsDisplayed() {
    console.log('OnboardingPage - verifyGetStartedIsDisplayed()')
    await this.assertInnerText(this.lbl_onboardingTitle, 'Get Started with Real World App')

    const elementInnerText = await this.lbl_onboardingTextContent.innerText()
    const cleanedInnerText = elementInnerText.replace(/\s+/g, ' ')
    expect(cleanedInnerText).toContain('Real World App requires a Bank Account to perform transactions. Click Next to begin setup of your Bank Account.')
  }

  async clickNextGetStartedAndVerifyCreateBankAccountDisplayed() {
    console.log('OnboardingPage - clickNextGetStartedAndVerifyCreateBankAccountDisplayed()')

    await this.btn_onboardingNext.click()
    await this.page.locator("//h2[text()='Create Bank Account']").waitFor() // TODO: Explain why use this line and why is it reasonable concept
    await this.assertInnerText(this.lbl_onboardingTitle, 'Create Bank Account')
  }

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

  async verifyFinishedScreenDisplayed() {
    console.log('OnboardingPage - verifyFinishedScreenDisplayed()')

    await this.page.locator("//h2[text()='Finished']").waitFor() // TODO: Explain why use this line and why is it reasonable concept
    await this.assertInnerText(this.lbl_onboardingTitle, 'Finished')

    const elementInnerText = await this.lbl_onboardingTextContent.innerText()
    const cleanedInnerText = elementInnerText.replace(/\s+/g, ' ')
    expect(cleanedInnerText).toContain("You're all set! We're excited to have you aboard the Real World App!")
  }

  async clickDoneAndVerifyUserCredentials() {
    console.log('OnboardingPage - clickDoneAndVerifyUserCredentials()')

    await this.btn_onboardingNext.click()

    const userFullName = await this.lbl_currentUser.innerText()
    const userUsername = (await this.lbl_currentUserUsername.innerText()).slice(1)

    expect(userFullName).toBe(this.ctx.user.firstName + ' ' + this.ctx.user.lastName?.charAt(0))
    expect(userUsername).toBe(this.ctx.user.username)
  }
}
