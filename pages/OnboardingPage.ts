import { APIRequestContext, Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class OnboardingPage extends BasePage {
  readonly page: Page
  readonly btn_doneNext: Locator
  readonly lbl_onboardingTitle: Locator
  readonly lbl_onboardingTextContent: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_doneNext = page.locator("[data-test='user-onboarding-next']")
    this.lbl_onboardingTitle = page.locator("[data-test='user-onboarding-dialog-title']")
    this.lbl_onboardingTextContent = page.locator("[data-test='user-onboarding-dialog-content'] p")
  }

  async verifyGetStartedIsDisplayed() {
    console.log('OnboardingPage - verifyGetStartedIsDisplayed()')
    await this.assertInnerText(this.lbl_onboardingTitle, 'Get Started with Real World App')

    const elementInnerText = await this.lbl_onboardingTextContent.innerText()
    const cleanedInnerText = elementInnerText.replace(/\s+/g, ' ')
    expect(cleanedInnerText).toContain('Real World App requires a Bank Account to perform transactions. Click Next to begin setup of your Bank Account.')
  }
}
