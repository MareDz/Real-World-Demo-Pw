export interface UserData {
  user: User
  bank: Bank
}

export type User = {
  firstName?: string
  lastName?: string
  password?: string
  username?: string
  email?: string
  phone?: string
  userID?: string
  cookie?: string
}

export type Bank = {
  bankName?: string
  routingNumber?: string
  accountNumber?: string
  balance?: number
  note?: string
  transactionAmmount?: number
}

export function createUserData(): UserData {
  return {
    user: {},
    bank: {},
  }
}