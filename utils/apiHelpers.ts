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
