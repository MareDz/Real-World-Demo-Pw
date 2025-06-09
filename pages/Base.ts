import { Locator, Page, expect } from '@playwright/test'
import { config } from 'dotenv'
import { resolve } from 'path'
import { Global } from '../state/Global'
import { UserData } from '../state/UserModel'

export class Base {
  readonly page: Page
  protected ctx: UserData

  constructor(page: Page, ctx: UserData) {
    this.page = page
    this.ctx = ctx
  }

  /**
   * Retrieves the appropriate environment configuration file based on the `NODE_ENV` variable.
   *
   * Determines which `.env` file to use (e.g., `.env.mix`, `.env.dev`, `.env.test`) based on the
   * current value of `process.env.NODE_ENV`. Throws an error if the environment variable is invalid
   * or not recognized.
   *
   * @returns {string} The name of the environment file.
   */
  private static getEnvFile(): string {
    switch (process.env.NODE_ENV) {
      case 'mix':
        return '.env.mix'
      case 'dev':
        return '.env.dev'
      case 'test':
        return '.env.test'
      default:
        throw new Error('Invalid NODE_ENV')
    }
  }

  /*
   * Initializes the environment configuration for the Cypress Real World App (RWA).
   *
   * - Loads environment-specific configuration from the `.env` file determined by `getEnvFile()`.
   * - Sets global variables such as application URL, server URL, admin-user credentials, API key, ...
   *   based on the `process.env.environment` variable.
   * - Supports both "test" and "dev" environments; throws an error for unrecognized environments.
   *
   * This method is crucial for ensuring the application connects to the correct environment during testing.
   */
  static initializeEnvironmentCRWA() {
    console.log('initializeEnvironmentCRWA()')
    const envFile = this.getEnvFile()
    config({ path: resolve(__dirname, '..', envFile) })

    switch (process.env.environment) {
      case 'test':
        Global.url = process.env.RWA_TEST_URL || ''
        Global.server_url = process.env.RWA_TEST_SERVER_URL || ''
        Global.adminUsername = process.env.RWA_TEST_ADMIN_USERNAME || ''
        Global.adminPassword = process.env.RWA_TEST_ADMIN_PASSWORD || ''
        Global.api_key = process.env.RWA_API_KEY || ''
        break
      case 'dev':
        Global.url = process.env.RWA_DEV_URL || ''
        Global.server_url = process.env.RWA_DEV_SERVER_URL || ''
        Global.adminUsername = process.env.RWA_DEV_ADMIN_USERNAME || ''
        Global.adminPassword = process.env.RWA_DEV_ADMIN_PASSWORD || ''
        Global.api_key = process.env.RWA_API_KEY || ''
        break
      default:
        throw new Error('Invalid environment')
    }
  }

  /***
   * TODO: Explain
   * Fill input field, textbox, textarea....
   * @param selector is selector
   * @param value is value that we're filling and asserting
   */
  async fillAndAssert(selector: Locator, value: string) {
    // console.log('Base - fillAndAssert()')
    console.log(`LogInfo: Fillig Locator: ${selector} - Value: "${value}"`)

    await selector.clear()
    await selector.fill(value)
    await selector.blur()
    await this.assertInputValue(selector, value)
  }

  /**
   * Assert data from input value
   * @param selector is selector
   * @param value is value that we're asserting
   */
  async assertInputValue(selector: Locator, value: string) {
    // console.log('Base - assertInputValue()')
    console.log(`LogInfo: Asserting value of selector: ${selector} with value: ${value}`)

    const innerValue = await selector.inputValue()
    expect(innerValue).toBe(value)
  }

  /**
   * Assert data from inner text
   * @param selector is selector
   * @param value is value that we're asserting
   */
  async assertInnerText(selector: Locator, value: string) {
    // console.log('Base - assertInnerText()')
    console.log(`LogInfo: Asserting text of selector: ${selector} with value: ${value}`)

    const elementInnerText = await selector.innerText()
    expect(elementInnerText).toBe(value)
  }

  /**
   * Assert that data
   * @param selector is selector
   * @param value is value that we're asserting
   */
  async assertInnerTextContain(selector: Locator, value: string) {
    // console.log('Base - assertInnerTextContain()')
    console.log(`LogInfo: Asserting text of selector: ${selector} with value: ${value}`)

    const elementInnerText = await selector.innerText()
    expect(elementInnerText).toContain(value)
  }

  /**
   * Clear up the field and blur it to lose focus
   * @param selector is selector
   */
  async clearAndBlur(selector: Locator) {
    // console.log('Base - clearAndBlur()')
    console.log(`LogInfo: Clearing and Bluring locator ${selector}`)

    await selector.clear()
    await selector.blur()
  }

  /**
   * Absolute page scrolling
   * @param up - absolute number of pixels for scrolling up
   * @param down - absolute number of pixels for scrolling down
   */
  async pageScrollMouse(up: number, down: number) {
    console.log(`pageScrollMouse() - Scrolling Up: ${up} Scrolling Down: ${down}`)
    await this.page.mouse.wheel(up, down)
  }

  /**
   * Retrieves the inner text of a given element, converts it to a number, and returns it.
   * @param selector - The element whose inner text is to be retrieved and converted.
   * @returns The numeric value of the element's inner text.
   */
  async getNumberFromElement(selector: Locator) {
    console.log('getNumberFromElement()')
    const number = await selector.innerText()
    return Number(number)
  }

  /**
   * Assert title and url
   * @param title - title of the page
   * @param url - optional param, url of the page
   */
  async assertTitleAndUrl(title: string, url?: string) {
    console.log('Base - assertTitleAndUrl()')
    console.log(`LogInfo: Title ${title} - URL ${url}`)

    await expect(this.page).toHaveTitle(title)

    if (url) {
      const urlPattern = new RegExp(`.*${url}.*`)
      await expect(this.page).toHaveURL(urlPattern)
    }
  }
}
