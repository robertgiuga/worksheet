export interface UserLogin {
  email?: string,
  token?: string,
  tokenExpirationDate?: Date,
  fullName?: string,
  role?:string
}
