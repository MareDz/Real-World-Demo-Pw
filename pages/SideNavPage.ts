import { expect, Locator, Page } from "@playwright/test"
import { BasePage } from "./BasePage"
import { UserData } from "../state/UserModel"

export class SideNavPage extends BasePage {
    readonly page: Page
    readonly btn_sideNav: Locator
    readonly btn_myAccount: Locator
    readonly btn_bankAccount: Locator
    readonly btn_notifications: Locator
    readonly lbl_moduleName: Locator
    readonly dom_sideNavVisibility: Locator

    constructor(page: Page, ctx: UserData){
        super(page, ctx)
        this.page = page
        this.ctx = ctx
        this.btn_sideNav = page.locator("[data-test='drawer-icon']")
        this.btn_myAccount = page.locator("[data-test='sidenav-user-settings']")
        this.btn_bankAccount = page.locator("[data-test='sidenav-bankaccounts']")
        this.btn_notifications = page.locator("[data-test='sidenav-notifications']")        
        this.lbl_moduleName = page.locator('//div/h2').first()
        this.dom_sideNavVisibility = page.locator("//div[@data-test='sidenav']//div[1]")
    }

    /**
     * Expands the side navigation menu from a collapsed state.
     * - Clicks the side nav toggle button to trigger the expansion.
     * - Asserts that the side nav is now visible by checking that its CSS `visibility` is not set to `hidden`.
     *   This ensures the menu has expanded successfully and is rendered on the screen.
     */
    async expandSideNav() {
        console.log('OnboardingPage - expandLeftMenu()')
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
        console.log('OnboardingPage - collapseSideNav()')
        await this.btn_sideNav.click()
        await expect(this.dom_sideNavVisibility).toHaveCSS('visibility', 'hidden')
    }

    /**
     * Clicks the "My Account" button in the navigation menu.
     * Verifies the page title and URL to ensure successful navigation to the correct page.
     * Asserts that the module name label displays the expected text: "User Settings".
     */
    async goToMyAccount() {
        console.log('NavigationPage - openMyAccount()')
        await this.btn_myAccount.click()
        await this.assertTitleAndUrl('Cypress Real World App', 'settings')
        await this.assertInnerText(this.lbl_moduleName, 'User Settings')
  }

  async goToBankAccounts() {
    console.log('NavigationPage - openBankAccounts()')
    await this.btn_bankAccount.click()
    await this.assertTitleAndUrl('Cypress Real World App', 'bankaccounts')
    await this.assertInnerText(this.lbl_moduleName, 'Bank Accounts')
  }

  async goToNotifications() {
    console.log('NavigationPage - openNotifications()')
    await this.btn_notifications.click()
    await this.assertTitleAndUrl('Cypress Real World App', 'notifications')
    await this.assertInnerText(this.lbl_moduleName.first(), 'Notifications')
  }
}