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
