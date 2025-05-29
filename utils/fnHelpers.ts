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
