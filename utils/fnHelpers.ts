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
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
    let chars = ''
    switch (caseType) {
      case 'lower':
        chars = lowerChars
        break;
      case 'upper':
        chars = upperChars
        break;
      case 'mixed':
        chars = lowerChars + upperChars
        break
    }
  
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      result += chars[randomIndex]
    }
  
    return result
  }
  