import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../model/User";
import {AuthService} from "../auth/auth.service";
import {UserLogin} from "../../model/UserLogin";
import {Activity} from "../../model/Activity";
import {Attendance} from "../../model/Attendance";

@Injectable({providedIn: 'root'})
export class UserService {
  user: UserLogin = {}

  constructor(private http: HttpClient, private authService: AuthService) {
    authService.user.subscribe(value => this.user = value);
  }

  getUsers() {
    return this.http.get<User[]>(
      'http://localhost:5000/api/user',
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  getLoggedUserActivities() {
    return this.http.get<Activity[]>(
      'http://localhost:5000/api/user/activities',
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  getUserActivities(userId: number) {
    return this.http.get<Activity[]>(
      'http://localhost:5000/api/user/' + userId + '/activities',
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  updateUser(user: User, userActivities: Activity[]) {
    return this.http.put<User>(
      'http://localhost:5000/api/user/' + user.id,
      {
        Id: user.id,
        GivenName: user.givenName,
        Surname: user.surname,
        Email: user.email,
        Role: user.role,
        Activities: userActivities
      },
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  addUser(user: User, userActivities: Activity[]) {
    return this.http.post<User>(
      'http://localhost:5000/api/user',
      {
        GivenName: user.givenName,
        Surname: user.surname,
        Email: user.email,
        Role: user.role,
        Activities: userActivities
      },
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  addCurrentUserAttendance(attendance: Attendance) {
    return this.http.post<Attendance>(
      'http://localhost:5000/api/attendance',
      attendance,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  getCurrentUserAttendance(date:string){
    return this.http.get<Attendance[]>(
      'http://localhost:5000/api/attendance/'+date,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  deleteAttendance(id: number){
    return this.http.delete(
      'http://localhost:5000/api/attendance/'+ id,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
      );
  }

  updateAttendance(attendance:Attendance){
    return this.http.put<Attendance>(
      'http://localhost:5000/api/attendance',
      attendance,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

  getHours(){
    return this.http.get<{ }>(
      'http://localhost:5000/api/attendance/hours',
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.user.token})}
    );
  }

}
