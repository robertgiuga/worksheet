import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../model/User";
import {AuthService} from "../auth/auth.service";
import {UserLogin} from "../../model/UserLogin";
import {Activity} from "../../model/Activity";

@Injectable({providedIn: 'root'})
export class UserService{
  user:UserLogin={}
  constructor(private http: HttpClient, private authService :AuthService) {
    authService.user.subscribe(value => this.user=value);
  }

  getUserDtos(){
    return this.http.get<User[]>(
      'http://localhost:5000/api/user',
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }

  getUserActivities(){
    return this.http.get<Activity[]>(
      'http://localhost:5000/api/user/activities',
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }
}
