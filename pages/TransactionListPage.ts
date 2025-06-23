import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { UserData } from '../state/UserModel'

export class TransactionListPage extends BasePage {
  readonly page: Page
  readonly lbl_everyoneTabTitle: Locator
  readonly lbl_friendsTabTitle: Locator
  readonly lbl_mineTabTitle: Locator

  constructor(page: Page, ctx: UserData) {
    super(page, ctx)
    this.page = page
    this.ctx = ctx
    this.lbl_everyoneTabTitle = page.locator("[data-test='nav-public-tab']")
    this.lbl_friendsTabTitle = page.locator("[data-test='nav-contacts-tab']")
    this.lbl_mineTabTitle = page.locator("[data-test='nav-personal-tab']")
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
    console.log('TransactionListPage')

    switch (tab) {
      case 'Everyone':
        await expect(this.lbl_everyoneTabTitle).toHaveAttribute('aria-selected', 'true')
        break
      case 'Friends':
        await expect(this.lbl_friendsTabTitle).toHaveAttribute('aria-selected', 'true')
        break
      case 'Mine':
        await expect(this.lbl_mineTabTitle).toHaveAttribute('aria-selected', 'true')
        break
      default:
        throw new Error('Invalid tab')
    }
  }
}
