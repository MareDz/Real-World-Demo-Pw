export interface UserData {
  user: User
  bank: Bank
}

export type User = {
  firstName: string | null
  lastName: string | null
  password: string | null
  username: string | null
  email?: string | null
  phone?: string | null
  userID?: string | null
}

export type Bank = {
  bankName: string | null
  routingNumber: string | null
  accountNumber: string | null
  balanceU1?: number | null
  balanceU2?: number | null
  transactionAmmount?: number | null
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
