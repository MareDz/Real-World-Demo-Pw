import { Global } from '../state/Global'
import { UserData } from '../state/UserModel'

/**
 * Fetches random user data from the 'randomuser.me' API and updates the provided test context.
 * Retries up to 10 times in case of errors or incomplete data.
 *
 * @param ctx - The UserData object to populate with user data.
 * @throws {Error} If valid user data is not retrieved within the retry limit.
 *
 * NOTE: If this free to use api endpoint goes down, use some custom method to create custom user
 * e.g. Name + getCurrentDateAndTime() in format YYYYMMDDHHmmssSSS
 */
export async function getNewUserData(ctx: UserData): Promise<void> {
  console.log('API Helper - getNewUserData()')

  const maxRetries = 10

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const RANDOM_USER_API_URL = 'https://randomuser.me/api/?password=upper,lower,5-9'
      const res = await fetch(RANDOM_USER_API_URL)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const data = await res.json()

      const user = data?.results?.[0]
      if (!user) throw new Error('No user data in response')

      const first = user.name?.first
      const last = user.name?.last
      const username = user.login?.username
      const password = user.login?.password
      const email = user.email

      if (first && last && username && email && password) {
        ctx.user.firstName = first
        ctx.user.lastName = last
        ctx.user.username = username
        ctx.user.email = email
        ctx.user.password = password

        console.log(`[${attempt}] Fetched user: ${first} ${last} | ${email} | ${username}`)
        return
      }

      throw new Error('Incomplete user data')
    } catch (err: any) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`)
      if (attempt === maxRetries) throw new Error('Failed to fetch valid user data after 10 attempts.')
    }
  }
}

/**
 * Registers a new user using classic fetch instead of Playwright's APIRequestContext.
 *
 * Updates the ctx with any provided overrides, sends a POST request to the registration endpoint,
 * asserts the response, and stores the user ID in the context.
 *
 * @param ctx - Shared test context holding user and bank data.
 * @param param_firstName - Optional override for the user's first name.
 * @param param_lastName - Optional override for the user's last name.
 * @param param_username - Optional override for the user's username.
 * @param param_password - Optional override for the user's password.
 * @param param_bankName - Optional override for the user's bank name.
 * @param param_accountNumber - Optional override for the user's account number.
 * @param param_routingNumber - Optional override for the user's routing number.
 * @param param_accountBalance - Optional override for the user's account balance.
 */
export async function POST_registerUser(ctx: UserData, param_firstName?: string, param_lastName?: string, param_username?: string, param_password?: string, param_bankName?: string, param_accountNumber?: string, param_routingNumber?: string, param_accountBalance?: number) {
  console.log('API Helper - POST_registerUser()')

  // Override ctx values if params are provided
  if (param_firstName) ctx.user.firstName = param_firstName
  if (param_lastName) ctx.user.lastName = param_lastName
  if (param_username) ctx.user.username = param_username
  if (param_password) ctx.user.password = param_password
  if (param_bankName) ctx.bank.bankName = param_bankName
  if (param_accountNumber) ctx.bank.accountNumber = param_accountNumber
  if (param_routingNumber) ctx.bank.routingNumber = param_routingNumber
  if (param_accountBalance) ctx.bank.balance = param_accountBalance

  const { firstName, lastName, username, password } = ctx.user
  const { bankName, accountNumber, routingNumber, balance } = ctx.bank

  const payload = {
    firstName,
    lastName,
    username,
    password,
    bankName,
    accountNumber,
    routingNumber,
    balance
  }

  try {
    const response = await fetch(`${Global.server_url}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`)
    }

    const responseBody = await response.json()
    console.log(responseBody)

    // Basic validation
    if (responseBody?.user?.firstName !== firstName || responseBody?.user?.lastName !== lastName || responseBody?.user?.username !== username) {
      throw new Error('Mismatch in returned user data')
    }

    ctx.user.userID = responseBody.user.id
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}

/**
 * Logs in a user using the Fetch API instead of Playwright's APIRequestContext.
 *
 * @param ctx - Shared test context holding user data.
 * @param param_username - Optional override for the user's username.
 * @param param_password - Optional override for the user's password.
 * @param param_userID - Optional override for the user's ID (used for response validation).
 */
export async function POST_loginUserWithFetch( ctx: UserData, param_username?: string, param_password?: string, param_userID?: string ) {
  console.log('API Helper - POST_loginUserWithFetch()')

  // Override context values if params are provided
  if (param_username) ctx.user.username = param_username
  if (param_password) ctx.user.password = param_password
  if (param_userID) ctx.user.userID = param_userID

  const { username, password, userID } = ctx.user

  const payload = {
    username: `${username}`,
    password: `${password}`,
    type: 'LOGIN',
  }

  try {
    const response = await fetch(`${Global.server_url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`)
    }

    const responseBody = await response.json()
    console.log(responseBody)

    // Validate user ID if provided
    if (userID && responseBody?.user?.id !== userID) {
      throw new Error(`Expected user ID '${userID}' but got '${responseBody?.user?.id}'`)
    }
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}

/**
 * Creates a bank account for a user via a GraphQL mutation using the Fetch API.
 *
 * @param ctx - Shared test context holding bank and user data.
 * @param param_bankName - Optional override for the bank name.
 * @param param_accountNumber - Optional override for the account number.
 * @param param_routingNumber - Optional override for the routing number.
 * @param param_userID - Optional override for the user ID (used for response validation).
 */
export async function POST_createBankAccountWithFetch( ctx: UserData, param_bankName?: string, param_accountNumber?: string, param_routingNumber?: string, param_userID?: string ) {
  console.log('API Helper - POST_createBankAccountWithFetch()')

  // Override values in test context if provided
  if (param_bankName) ctx.bank.bankName = param_bankName
  if (param_accountNumber) ctx.bank.accountNumber = param_accountNumber
  if (param_routingNumber) ctx.bank.routingNumber = param_routingNumber
  if (param_userID) ctx.user.userID = param_userID

  const { bankName, accountNumber, routingNumber } = ctx.bank
  const { userID } = ctx.user

  const graphqlPayload = {
    operationName: 'CreateBankAccount',
    query: `
      mutation CreateBankAccount {
        createBankAccount(
          bankName: "${bankName}"
          accountNumber: "${accountNumber}"
          routingNumber: "${routingNumber}"
        ) {
          id
          uuid
          userId
          bankName
          accountNumber
          routingNumber
          isDeleted
          createdAt
        }
      }
    `,
  }

  try {
    const response = await fetch(`${Global.server_url}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlPayload),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`)
    }

    const responseBody = await response.json()
    console.log(responseBody)

    const result = responseBody?.data?.createBankAccount
    if (!result) throw new Error('No createBankAccount data returned.')

    // Validate against expected context
    if (userID && result.userId !== userID)
      throw new Error(`Expected userId '${userID}' but got '${result.userId}'`)
    if (result.bankName !== bankName)
      throw new Error(`Expected bankName '${bankName}' but got '${result.bankName}'`)
    if (result.accountNumber !== accountNumber)
      throw new Error(`Expected accountNumber '${accountNumber}' but got '${result.accountNumber}'`)
    if (result.routingNumber !== routingNumber)
      throw new Error(`Expected routingNumber '${routingNumber}' but got '${result.routingNumber}'`)
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}

/**
 * PATCH request to update user account details using Fetch API.
 *
 * @param ctx - Shared test context holding user data.
 * @param param_email - Optional email to override test context.
 * @param param_firstName - Optional first name to override test context.
 * @param param_lastName - Optional last name to override test context.
 * @param param_phone - Optional phone number to override test context.
 * @param param_userID - Optional user ID to override test context.
 */
export async function PATCH_completeAccountDetailsWithFetch( ctx: UserData, param_email?: string, param_firstName?: string, param_lastName?: string, param_phone?: string, param_userID?: string ) {
  console.log('API Helper - PATCH_completeAccountDetailsWithFetch()')

  // Override test context values if provided
  if (param_firstName) ctx.user.firstName = param_firstName
  if (param_lastName) ctx.user.lastName = param_lastName
  if (param_email) ctx.user.email = param_email
  if (param_phone) ctx.user.phone = param_phone
  if (param_userID) ctx.user.userID = param_userID

  const { firstName, lastName, email, phone, userID } = ctx.user

  const payload = {
    email: email ?? '',
    firstName: firstName ?? '',
    id: userID ?? '',
    lastName: lastName ?? '',
    phoneNumber: phone ?? '',
  }

  try {
    const response = await fetch(`${Global.server_url}/users/${userID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.status !== 204) {
      const responseBody = await response.text()
      throw new Error(`Expected status 204 but got ${response.status}.\nResponse body: ${responseBody}`)
    }
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}
