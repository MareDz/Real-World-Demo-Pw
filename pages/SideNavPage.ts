import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class SideNavPage extends BasePage {
  readonly page: Page
  readonly btn_sideNav: Locator
  readonly btn_home: Locator
  readonly btn_myAccount: Locator
  readonly btn_bankAccount: Locator
  readonly btn_notifications: Locator
  readonly btn_logout: Locator
  readonly lbl_moduleName: Locator
  readonly lbl_accountBalance: Locator
  readonly dom_sideNavVisibility: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.btn_sideNav = page.locator("[data-test='drawer-icon']")
    this.btn_home = page.locator("[data-test='sidenav-home']")
    this.btn_myAccount = page.locator("[data-test='sidenav-user-settings']")
    this.btn_bankAccount = page.locator("[data-test='sidenav-bankaccounts']")
    this.btn_notifications = page.locator("[data-test='sidenav-notifications']")
    this.btn_logout = page.locator("[data-test='sidenav-signout']")
    this.lbl_moduleName = page.locator('//div/h2').first()
    this.lbl_accountBalance = page.locator("[data-test='sidenav-user-balance']")
    this.dom_sideNavVisibility = page.locator("//div[@data-test='sidenav']//div[1]")
  }

  /**
   * Expands the side navigation menu from a collapsed state.
   * - Clicks the side nav toggle button to trigger the expansion.
   * - Asserts that the side nav is now visible by checking that its CSS `visibility` is not set to `hidden`.
   *   This ensures the menu has expanded successfully and is rendered on the screen.
   */
  async expandSideNav() {
    console.log('SideNavPage - expandLeftMenu()')
    await this.btn_sideNav.click()
    await expect(this.dom_sideNavVisibility).not.toHaveCSS('visibility', 'hidden')
  }

  /**
   * Collapses the side navigation menu.
   * - Clicks the side nav toggle button to trigger the collapse action.
   * - Asserts that the side nav is now hidden by verifying its CSS `visibility` is set to `hidden`.
   *   This confirms the menu has collapsed and is no longer visible on the screen.
   */
  async collapseSideNav() {
    console.log('SideNavPage - collapseSideNav()')
    await this.btn_sideNav.click()
    await expect(this.dom_sideNavVisibility).toHaveCSS('visibility', 'hidden')
  }

  /**
   * Clicks the "My Account" button in the navigation menu.
   * Verifies the page title and URL to ensure successful navigation to the correct page.
   * Asserts that the module name label displays the expected text: "User Settings".
   */
  async goToMyAccount() {
    console.log('SideNavPage - openMyAccount()')
    await this.btn_myAccount.click()
    await this.assertTitleAndUrl('Cypress Real World App', 'settings')
    await this.assertInnerText(this.lbl_moduleName, 'User Settings')
  }

  async goToBankAccounts() {
    console.log('SideNavPage - openBankAccounts()')
    await this.btn_bankAccount.click()
    await this.assertTitleAndUrl('Cypress Real World App', 'bankaccounts')
    await this.assertInnerText(this.lbl_moduleName, 'Bank Accounts')
  }

  async goToNotifications() {
    console.log('SideNavPage - openNotifications()')
    await this.btn_notifications.click()
    await this.assertTitleAndUrl('Cypress Real World App', 'notifications')
    await this.assertInnerText(this.lbl_moduleName.first(), 'Notifications')
  }

  async goToHome() {
    console.log('SideNavPage - openHome()')
    await this.btn_home.click()
    await this.assertTitleAndUrl('Cypress Real World App')
    // Note: Home doesn't have any name in URL
  }

  async logout() {
    console.log('SideNavPage - logout()')
    await this.btn_logout.click()
    await this.assertTitleAndUrl('Cypress Real World App', 'signin')
  }

  /**
   * Retrieves and parses the user's current account balance from the UI,
   * then stores the value in the test context (`ctx.bank.balance`).
   *
   * - Reads the visible balance text (e.g., "$1,234.00")
   * - Removes the dollar sign, commas, and decimal portion
   * - Parses the cleaned string into an integer
   * - Saves the result to the shared test context for later assertions or usage
   *
   * Example:
   *   "$1,234.00" → 1234
   */
  async getAccountBalance() {
    console.log('SideNavPage - getAccountBalance()')

    const accountBalance = await this.lbl_accountBalance.innerText()
    const cleanedString = accountBalance.replace('$', '').replace('.00', '')
    const accountBalanceFormated = parseInt(cleanedString.replace(/,/g, ''), 10)

    console.log(`Account Balance is: ${accountBalanceFormated}`)
    this.ctx.bank.balance = accountBalanceFormated
  }
}
