import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { UserData } from "../state/UserModel";

export class MyAccountPage extends BasePage {
    readonly page: Page
    readonly btn_save: Locator
    readonly inp_email: Locator
    readonly inp_phoneNumber: Locator
    readonly lbl_errorFirstName: Locator
    readonly lbl_errorLastName: Locator
    readonly lbl_errorEmail: Locator
    readonly lbl_errorPhoneNumber: Locator

    constructor(page: Page, ctx: UserData){
        super(page, ctx)
        this.page = page
        this.ctx = ctx
        this.btn_save = page.locator("[data-test='user-settings-submit']")
        this.inp_email = page.locator("[data-test='user-settings-email-input']")
        this.inp_phoneNumber = page.locator("[data-test='user-settings-phoneNumber-input']")
        this.lbl_errorFirstName = page.locator("[id='user-settings-firstName-input-helper-text']")
        this.lbl_errorLastName = page.locator("[id='user-settings-lastName-input-helper-text']")
        this.lbl_errorEmail = page.locator("[id='user-settings-email-input-helper-text']")
        this.lbl_errorPhoneNumber = page.locator("[id='user-settings-phoneNumber-input-helper-text']")
    }

/**
   * Verifies that the user account details displayed on the UI match the expected values.
   *
   * This function checks the displayed values for first name, last name, email, and phone number.
   * If any of the parameters are not provided, it falls back to using the values stored in the context.
   * This ensures that the function can work with both provided and default (context) values for validation.
   *
   * @param param_firstName - The first name to check on the UI (optional). Falls back to context if not provided.
   * @param param_lastName - The last name to check on the UI (optional). Falls back to context if not provided.
   * @param param_email - The email to check on the UI (optional). Falls back to context if not provided.
   * @param param_phone - The phone number to check on the UI (optional). Falls back to context if not provided.
   */
  async verifyDisplayedAccountDetails(param_email?: string, param_phone?: string, param_firstName?: string, param_lastName?: string) {
    console.log('MyAccount - verifyDisplayedAccountDetails()')

    const firstName = param_firstName ?? this.ctx.user.firstName
    const lastName = param_lastName ?? this.ctx.user.lastName
    const email = param_email ?? this.ctx.user.email
    const phone = param_phone ?? this.ctx.user.phone  

    await this.assertInputValue(this.inp_firstName, String(firstName))
    await this.assertInputValue(this.inp_lastName, String(lastName))
    await this.assertInputValue(this.inp_email, String(email))
    await this.assertInputValue(this.inp_phoneNumber, String(phone))
  }
}