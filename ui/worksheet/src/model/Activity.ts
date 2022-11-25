import {User} from "./User";

export interface Activity{
  id?:number,
  name?: string,
  description?: string,
  users?: User[]
}
