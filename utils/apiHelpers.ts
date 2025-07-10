import { APIRequestContext, expect } from '@playwright/test'
import { Global } from '../state/Global'
import { UserData } from '../state/UserModel'
import { generateRandomPhoneNumber } from './fnHelpers'

/**
 * Fetches random user data from the 'randomuser.me' API and updates the provided test context.
 * Retries up to 10 times in case of errors or incomplete data.
 *
 * @param ctx - The UserData object to populate with user data.
 * @throws {Error} If valid user data is not retrieved within the retry limit.
 *
 * NOTE: If this free api endpoint goes down, use some custom method to create custom user data
 * e.g. Name + getCurrentDateAndTime() in format YYYYMMDDHHmmssSSS
 */
export async function GET_getNewUserData(ctx: UserData): Promise<void> {
  console.log('API Helper - GET_getNewUserData()')

  const maxRetries = 10

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const RANDOM_USER_API_URL = 'https://randomuser.me/api/?password=upper,lower,5-9'
      const res = await fetch(RANDOM_USER_API_URL)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const data = await res.json()

      const user = data?.results?.[0]
      if (!user) throw new Error('No user data in response')

      const first = user.name.first
      const last = user.name.last
      const username = user.login.username
      const password = user.login.password
      const email = user.email

      if (first && last && username && email && password) {
        ctx.user.firstName = first
        ctx.user.lastName = last
        ctx.user.username = username
        ctx.user.email = email
        ctx.user.password = password
        ctx.user.phone = generateRandomPhoneNumber() // API That's getting user data doens't have phone. This doesn't look that nice but it's only for demo for data preparation.

        console.log(`[${attempt}] Fetched user: ${first} ${last} | ${email} | ${username} | ${ctx.user.phone}`)
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
 * Registers a new user by sending a POST request to the /users endpoint.
 * It uses values from the test context to create the new user.
 * The function also updates the test context with the user ID received from the server (userID).
 *
 * @param request The Playwright APIRequestContext used to send the POST request.
 * @param testContext The context that stores user and bank data, which will be used in registration.
 * @throws Will throw an error if the API request fails or returns a status other than 201.
 */
export async function POST_registerUser(request: APIRequestContext, ctx: UserData) {
  console.log('API Helper - POST_registerUser()')

  // Use the updated values
  const { firstName, lastName, username, password } = ctx.user
  const { bankName, accountNumber, routingNumber } = ctx.bank

  try {
    const responseRegister = await request.post(`${Global.server_url}/users`, {
      data: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        bankName: bankName,
        accountNumber: accountNumber,
        routingNumber: routingNumber,
        balance: '500000', // NOTE: hardcoded just to have some balance != 0 so that we can make transactions, etc...
      },
    })

    expect(responseRegister.status()).toBe(201)
    const responseBodyRegister = await responseRegister.json()
    console.log(responseBodyRegister)

    expect(firstName).toBe(responseBodyRegister.user.firstName)
    expect(lastName).toBe(responseBodyRegister.user.lastName)
    expect(username).toBe(responseBodyRegister.user.username)
    ctx.user.userID = responseBodyRegister.user.id
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}

/**
 * Logs in a user by sending a POST request to the /login endpoint.
 * It uses the provided parameters (if any) or the values from the test context to perform the login.
 * The function validates the response by ensuring the user ID in the response matches the stored user ID in the test context.
 *
 * @param request The Playwright APIRequestContext used to send the POST request.
 * @param testContext The context that stores user data, which will be used to login the user.
 * @throws Will throw an error if the API request fails or if the user ID in the response does not match the expected user ID.
 */
export async function POST_loginUser(request: APIRequestContext, ctx: UserData) {
  console.log('API Helper - POST_loginUser()')

  const { username, password, userID } = ctx.user

  try {
    const responseLogin = await request.post(`${Global.server_url}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        password: `${password}`,
        type: 'LOGIN',
        username: `${username}`,
      },
    })
    expect(responseLogin.status()).toBe(200)
    const responseBodyLogin = await responseLogin.json()
    console.log(responseBodyLogin)

    expect(responseBodyLogin.user.id).toBe(userID)
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}

/**
 * Creates a bank account for a user by sending a POST request to the GraphQL endpoint.
 * It uses the provided parameters (if any) or the values from the test context to create the bank account.
 * After receiving the response, the function validates the created bank account data to ensure it matches the expected values.
 *
 * @param request The Playwright APIRequestContext used to send the POST request.
 * @param testContext The context that stores user and bank data to be used for creating the bank account.
 * @param param_bankName Optional parameter for the bank's name. If not provided, the value from the test context is used.
 * @param param_accountNumber Optional parameter for the bank account number. If not provided, the value from the test context is used.
 * @param param_routingNumber Optional parameter for the bank routing number. If not provided, the value from the test context is used.
 * @param param_userID Optional parameter for the user's ID. If not provided, the value from the test context is used.
 *
 * @throws Will throw an error if the API request fails or if the created bank account data does not match the expected values.
 */
export async function POST_createBankAccount(request: APIRequestContext, ctx: UserData, param_bankName?: string, param_accountNumber?: string, param_routingNumber?: string, param_userID?: string) {
  console.log('API Helper - POST_createBankAccount()')

  if (param_bankName) ctx.bank.bankName = param_bankName
  if (param_accountNumber) ctx.bank.accountNumber = param_accountNumber
  if (param_routingNumber) ctx.bank.routingNumber = param_routingNumber
  if (param_userID) ctx.user.userID = param_userID

  const { bankName, accountNumber, routingNumber } = ctx.bank
  const { userID } = ctx.user

  try {
    const responseBank = await request.post(`${Global.server_url}/graphql`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
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
      },
    })
    expect(responseBank.status()).toBe(200)
    const responseBodyBank = await responseBank.json()
    console.log(responseBodyBank)

    expect(responseBodyBank.data.createBankAccount.userId).toBe(userID)
    expect(responseBodyBank.data.createBankAccount.bankName).toBe(bankName)
    expect(responseBodyBank.data.createBankAccount.accountNumber).toBe(accountNumber)
    expect(responseBodyBank.data.createBankAccount.routingNumber).toBe(routingNumber)
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}

/**
 * Updates the user's account details by sending a PATCH request to the API endpoint.
 * It allows updating optional user information such as email, first name, last name, and phone number.
 * The function checks for any provided parameters and updates the corresponding fields in the user's data.
 *
 * @param request The Playwright APIRequestContext used to send the PATCH request.
 * @param testContext The context that holds the user's current data.
 * @throws Will throw an error if the API request fails or if the update request doesn't return the expected status.
 */
export async function PATCH_completeAccountDetails(request: APIRequestContext, ctx: UserData) {
  console.log('API Helper - PATCH_completeAccountDetails()')

  const { firstName, lastName, email, phone, userID } = ctx.user

  try {
    const response = await request.patch(`${Global.server_url}/users/${ctx.user.userID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: `${email}`,
        firstName: `${firstName}`,
        id: `${userID}`,
        lastName: `${lastName}`,
        phoneNumber: `${phone}`,
      },
    })
    expect(response.status()).toBe(204)
  } catch (error: any) {
    console.error('API request failed:', error.message)
    throw error
  }
}
