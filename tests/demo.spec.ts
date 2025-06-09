import { Base } from '../pages/Base'
import { GET_getNewUserData, PATCH_completeAccountDetails, POST_createBankAccount, POST_loginUser, POST_registerUser } from '../utils/apiHelpers'
import { test } from '../utils/fixturesModel'
import { getAccountNumber, getBankName, getRoutingNumber } from '../utils/fnHelpers'

test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  Base.initializeEnvironmentCRWA()
})

test.beforeEach(async ({ loginPage }) => {
  await loginPage.launchRWA()
})

test.afterEach(async ({ page }) => {
  await page.close()
})

test('Register API Test', async ({ ctx, request, page }) => {
  await GET_getNewUserData(ctx)
  await POST_registerUser(request, ctx)
  await POST_loginUser(request, ctx)
  await PATCH_completeAccountDetails(request, ctx, 'random@mail.com', '123123123')
  await POST_createBankAccount(request, ctx, getBankName(), getAccountNumber(), getRoutingNumber())
})
