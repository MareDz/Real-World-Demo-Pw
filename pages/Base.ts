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

  /**
   * Fills the given input field with a specified value and verifies the input was successful.
   *
   * - Clears any existing value from the input field.
   * - Fills the input field with the provided value.
   * - Blurs the input to trigger any client-side validation or formatting.
   * - Asserts that the input field contains the expected value after the fill.
   *
   * Useful for:
   * - Ensuring reliable and consistent input field interaction.
   * - Preventing flaky tests caused by incomplete or delayed input rendering.
   *
   * @param selector - The Playwright `Locator` targeting the input field.
   * @param value - The string value to fill into the input field.
   */
  async fillAndAssert(selector: Locator, value: string) {
    console.log('fillAndAssert()')
    console.log(`LogInfo: Fillig Locator: ${selector} - Value: "${value}"`)

    await selector.clear()
    await selector.fill(value)
    await selector.blur()
    await this.assertInputValue(selector, value)
  }

  /**
   * Asserts that the given input field contains the expected value.
   *
   * This method is used to verify that the current value of an input field
   * matches the expected string value. It retrieves the field's input value
   * and compares it using a strict equality check.
   *
   * Useful for:
   * - Validating that a field was correctly filled in a previous step.
   * - Ensuring data consistency during form interactions in tests.
   *
   * @param selector - The Playwright `Locator` pointing to the input field.
   * @param value - The expected string value that should be present in the input.
   */
  async assertInputValue(selector: Locator, value: string) {
    console.log('Base - assertInputValue()')
    console.log(`LogInfo: Asserting value of selector: ${selector} with value: ${value}`)

    const innerValue = await selector.inputValue()
    expect(innerValue).toBe(value)
  }

  /**
   * Asserts that the inner text content of the given element matches the expected value.
   *
   * This method retrieves the inner text of a DOM element using the provided locator
   * and performs a strict comparison against the expected string value.
   *
   * Useful for:
   * - Verifying labels, error messages, button text, or any static/dynamic text elements.
   * - Ensuring UI elements display the correct content during test execution.
   *
   * @param selector - The Playwright `Locator` targeting the element whose text should be validated.
   * @param value - The exact expected text content to assert against.
   */
  async assertInnerText(selector: Locator, value: string) {
    console.log(`assertInnerText() | Asserting text of selector: ${selector} with value: ${value}`)

    const elementInnerText = await selector.innerText()
    expect(elementInnerText).toBe(value)
  }

  /**
   * Asserts that the inner text of a given element contains the expected substring.
   *
   * This method retrieves the inner text from the provided locator and checks if it includes
   * the specified string value. Useful for validating partial matches within dynamic or
   * templated UI text (e.g., success messages, transaction summaries).
   *
   * Example:
   *   - Verifying "Paid $100 for dinner" contains "$100"
   *
   * @param selector - The Playwright `Locator` targeting the element to inspect.
   * @param value - The substring expected to be found within the element's inner text.
   */
  async assertInnerTextContain(selector: Locator, value: string) {
    console.log(`assertInnerTextContain() | Asserting selector: ${selector} contains value: "${value}"`)

    const elementInnerText = await selector.innerText()
    expect(elementInnerText).toContain(value)
  }

  /**
   * Clears the input field and triggers the `blur` event on the specified locator.
   *
   * This is typically used to simulate a user clearing a field and clicking away from it (switch focus),
   * which can trigger client-side validation or error messages in UI forms.
   *
   * Useful for:
   * - Validating required field errors
   * - Ensuring blur-based validations are fired
   *
   * @param selector - The Playwright `Locator` representing the input element to clear and blur.
   */
  async clearAndBlur(selector: Locator) {
    console.log(`clearAndBlur() | Clearing and blurring locator: ${selector}`)

    await selector.clear()
    await selector.blur()
  }

  /**
   * Extracts a number from the inner text of a given locator element.
   *
   * @param selector - Playwright locator from which to extract the number.
   * @returns A numeric value parsed from the element’s text content.
   */
  async getNumberFromElement(selector: Locator) {
    console.log(`getNumberFromElement() | Extracting number from: ${selector}`)
    const number = await selector.innerText()
    return Number(number)
  }

  /**
   * Asserts that the current page has the expected title and optionally includes the expected URL path.
   *
   * - Verifies that the page title matches the provided `title`.
   * - If a `url` is provided, verifies that the current page URL contains the specified path using a RegExp.
   *
   * @param title - The expected page title.
   * @param url - (Optional) A substring or pattern expected to be found in the page URL.
   */
  async assertTitleAndUrl(title: string, url?: string) {
    console.log(`assertTitleAndUrl() | Asserting page title is "${title}"${url ? ` and URL contains "${url}"` : ''}`)

    await expect(this.page).toHaveTitle(title)

    if (url) {
      const urlPattern = new RegExp(`.*${url}.*`)
      await expect(this.page).toHaveURL(urlPattern)
    }
  }
}
