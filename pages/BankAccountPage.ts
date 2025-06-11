import { Page, Locator } from "@playwright/test"
import { BasePage } from "./BasePage"
import { UserData } from "../state/UserModel"

export class BankAccountPage extends BasePage {

    readonly page: Page

    constructor(page: Page, ctx: UserData){
        super(page, ctx)
        this.page = page
        this.ctx = ctx
    }
}