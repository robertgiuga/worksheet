import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../model/User";
import {AuthService} from "../auth/auth.service";
import {UserLogin} from "../../model/UserLogin";
import {Activity} from "../../model/Activity";

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
    return this.http.put(
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
    return this.http.post(
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
}
