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
}

export type Bank = {
  bankName?: string
  routingNumber?: string
  accountNumber?: string
  balanceU1?: number
  balanceU2?: number
  transactionAmmount?: number
}

export function createUserData(): UserData {
  return {
    user: {}, 
    bank: {}
  }
}

// Cy-RWA Official User Interface
// export interface User {
//     id: string;
//     uuid: string;
//     firstName: string;
//     lastName: string;
//     username: string;
//     password: string;
//     email: string;
//     phoneNumber: string;
//     balance: number;
//     avatar: string;
//     defaultPrivacyLevel: DefaultPrivacyLevel;
//     createdAt: Date;
//     modifiedAt: Date;
//   }