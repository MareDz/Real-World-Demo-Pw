import { UserData } from './UserModel'

export function userDataConst(): UserData {
  return {
    user: {
      firstName: null,
      lastName: null,
      password: null,
      username: null,
      email: null,
      phone: null,
    },
  
    bank: {
      bankName: null,
      routingNumber: null,
      accountNumber: null,
      balanceU1: null,
      balanceU2: null,
      transactionAmmount: null,
    }
  }
}
