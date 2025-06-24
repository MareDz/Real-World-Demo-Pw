import { expect } from '@playwright/test'

/**
 * Generates a random string of alphabetic characters.
 *
 * @param length - Optional. The length of the generated string. Defaults to 10.
 * @param caseType - Optional. Determines the character case to use:
 *    - 'lower': uses lowercase letters only (a-z)
 *    - 'upper': uses uppercase letters only (A-Z)
 *    - 'mixed': uses both lowercase and uppercase letters (a-zA-Z). This is the default.
 *
 * @returns A random string of the specified length and character case.
 *
 * Example usage:
 *    getRandomString(); // e.g., "AbcDEfgHij"
 *    getRandomString(5, 'lower'); // e.g., "xqyzt"
 *    getRandomString(8, 'upper'); // e.g., "WERTYUOP"
 */
export function getRandomString(length: number = 10, caseType: 'lower' | 'upper' | 'mixed' = 'mixed'): string {
  console.log('getRandomString()')
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let chars = ''
  switch (caseType) {
    case 'lower':
      chars = lowerChars
      break
    case 'upper':
      chars = upperChars
      break
    case 'mixed':
      chars = lowerChars + upperChars
      break
  }

  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }

  return result
}

/**
 * Generates a random bank name from a predefined list of banks.
 * The function selects a random bank from the list and returns it as a string.
 *
 * @returns A randomly selected bank name from the list of available banks.
 */
export const getBankName = (): string => {
  console.log('getBankName()')

  const banks: string[] = ['Banca Intesa', 'Raiffeisen', 'OTP Bank', 'AIK Bank', 'Erste Bank', 'NLB Bank', 'Mobi Bank']
  const randomBank = Math.floor(Math.random() * banks.length)
  return banks[randomBank]
}

/**
 * Generates a random routing number consisting of alphanumeric characters.
 * The default length of the routing number is 9 characters, but this can be customized by providing a length parameter.
 * The routing number is created by concatenating random alphanumeric characters from the set [A-Z, a-z, 0-9].
 *
 * @param length - The length of the routing number to generate (default is 9).
 * @returns A string representing the randomly generated routing number.
 */
export const getRoutingNumber = (length: number = 9): string => {
  console.log('getRoutingNumber()')

  const getRandomChar = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const randomIndex = Math.floor(Math.random() * chars.length)
    return chars[randomIndex]
  }

  let routingNumber = ''
  for (let i = 0; i < length; i++) {
    routingNumber += getRandomChar()
  }
  return routingNumber
}

/**
 * Generates a random account number of a specified length, with a length
 * between the provided `minLength` and `maxLength`. The account number
 * consists of random digits (0-9).
 *
 * @param minLength The minimum length of the account number. Default is 9.
 * @param maxLength The maximum length of the account number. Default is 12.
 *
 * @returns A randomly generated account number as a string of digits.
 */
export const getAccountNumber = (minLength: number = 9, maxLength: number = 12): string => {
  console.log('getAccountNumber()')

  const getRandomChar = (): string => {
    const chars = '0123456789'
    const randomIndex = Math.floor(Math.random() * chars.length)
    return chars[randomIndex]
  }

  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
  let result = ''
  for (let i = 0; i < length; i++) {
    result += getRandomChar()
  }
  return result
}

/**
 * Generates a random 10-digit phone number using only numeric characters (0–9).
 *
 * - Useful for testing forms or APIs that require a valid-looking phone number.
 * - Returns a string of exactly 10 digits with no formatting (e.g., no dashes or spaces).
 * - Digits are randomly generated and joined into a single string.
 *
 * Example output: "6283417720"
 */
export function generateRandomPhoneNumber(): string {
  console.log('generateRandomPhoneNumber()')

  const digits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
  return digits.join('')
}

/*
Generate current date in format as YYYYMMDDHHmmssSSS
*/
export const getCurrentDateTimeAsNumbers = (): string => {
  console.log('getCurrentDateTimeAsNumbers()')
  const now = new Date()

  const year = now.getFullYear().toString()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const milliseconds = now.getMilliseconds().toString().padStart(2, '0')

  const formattedDateTime = year + month + day + hours + minutes + seconds + milliseconds
  console.log('Current Date and Time: ' + formattedDateTime)

  return formattedDateTime
}

  /**
   * Formats a number into a currency string with dollar sign, commas and 2 decimals.
   *
   * @param amount - The numeric amount to format.
   * @returns The formatted currency string, e.g. "$55,341,124.00".
   */
  export function formatCurrency(amount: number): string {
    console.log('formatCurrency')

    const formatedAmount = `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    return formatedAmount
  }

  /**
   * Verifies that the user's account balance has been correctly updated after making a payment.
   *
   * - Subtracts the transaction amount from the account balance before the payment.
   * - Compares the calculated expected balance with the actual current balance.
   * - Fails the test if the values do not match.
   *
   * @param accountBalanceBeforeTransaction - The user's account balance before making the payment.
   * @param transactionAmount - The amount that was paid in the transaction.
   * @param currentBalance - The current balance fetched after the payment.
   */
  export function verifyBalanceChangeAfterPaying(accountBalanceBeforeTransaction: number, transactionAmount: number, currentBalance: number){
    console.log('verifyBalanceChangeAfterPaying')

    expect(accountBalanceBeforeTransaction-transactionAmount).toBe(currentBalance)
  }

  /**
   * Verifies that the user's account balance has increased correctly after receiving a payment.
   *
   * This function checks whether the current account balance is equal to the expected balance,
   * which is calculated by adding the transaction amount to the balance before the transaction.
   *
   * @param accountBalanceBeforeReceiving - The user's account balance before the payment was received.
   * @param transactionAmmount - The amount of money that was received in the transaction.
   * @param currentBalance - The user's current account balance after the transaction.
   */
  export function verifyBalanceChangeAfterReceiving(accountBalanceBeforeReceiving: number, transactionAmmount: number, currentBalance: number) {
    console.log('verifyBalanceChangeAfterReceiving')

    expect(accountBalanceBeforeReceiving+transactionAmmount).toBe(currentBalance)
  }