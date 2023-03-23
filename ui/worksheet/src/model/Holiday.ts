import {User} from "./User";

export interface Holiday{
  id?: number,
  user?:User,
  startDate?:string,
  endDate?:string,
  status?: string
}
