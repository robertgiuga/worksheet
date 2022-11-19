export interface User {
  email?: string,
  token?: string,
  tokenExpirationDate?: Date,
  fullName?: string,
  role?:string
}
