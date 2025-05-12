import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'
import { test as base } from '@playwright/test'
import { createUserData, UserData } from '../state/UserModel'
import { OnboardingPage } from '../pages/OnboardingPage'

type Fixtures = {
  loginPage: LoginPage
  registrationPage: RegistrationPage
  onboardingPage: OnboardingPage
  ctx: UserData
}

export const test = base.extend<Fixtures>({
  ctx: async ({}, use) => {
    const ctx = createUserData()
    await use(ctx)
  },

  loginPage: async ({ page, ctx }, use) => {
    await use(new LoginPage(page, ctx))
  },

  registrationPage: async ({ page, ctx }, use) => {
    await use(new RegistrationPage(page, ctx))
  },

  onboardingPage: async ({ page, ctx }, use) => {
    await use(new OnboardingPage(page, ctx))
  }
})
