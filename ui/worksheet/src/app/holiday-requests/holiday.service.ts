import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Holiday} from "../../model/Holiday";
import {AuthService} from "../auth/auth.service";
import {UserLogin} from "../../model/UserLogin";

@Injectable({providedIn: 'root'})
export class HolidayService{
  user: UserLogin = {}
  constructor(private http: HttpClient, private authService: AuthService) {
    authService.user.subscribe(value => this.user = value);
  }

  getUserHolidayDays(){
    return this.http.get<{ }>(
      'http://localhost:5000/api/holiday/days',
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  addHolidayRequest(value:Holiday){
    return this.http.post<Holiday>(
      'http://localhost:5000/api/holiday',
      value,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  getUserHolidayRequests(){
    return this.http.get<Holiday[]>(
      'http://localhost:5000/api/holiday/my-requests',
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  getPendingHolidayRequests(){
    return this.http.get<Holiday[]>(
      'http://localhost:5000/api/holiday/requests',
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  acceptHolidayRequest(holidayRequestId:number){
    return this.http.patch(
      'http://localhost:5000/api/holiday/accept',
      holidayRequestId,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }
  declineHolidayRequest(holidayRequestId:number){
    return this.http.patch(
      'http://localhost:5000/api/holiday/decline',
      holidayRequestId,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }
  deleteHolidayRequest(holidayRequestId:number){
    return this.http.delete("http://localhost:5000/api/holiday/"+holidayRequestId,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
      )
  }
}
