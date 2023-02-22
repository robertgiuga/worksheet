import {User} from "./User";
import {Activity} from "./Activity";

export interface Attendance{
  id?: number,
  user?: User,
  checkIn?: string,
  checkOut?: string,
  activity?: Activity,
  comment?: string
}
