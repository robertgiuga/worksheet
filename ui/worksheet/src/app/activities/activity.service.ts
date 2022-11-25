import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Activity} from "../../model/Activity";
import {AuthService} from "../auth/auth.service";
import {User} from "../../model/User";
import {UserDto} from "../../model/UserDto";

@Injectable({providedIn:'root'})
export class ActivityService{
  user:User={};
  constructor(private http: HttpClient, private authService:AuthService) {
    authService.user.subscribe(value => this.user=value);
  }

  getActivities(){
    return this.http.get<Activity[]>(
      'http://localhost:5000/api/activity',
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})});
  }

  getActivityUsers(id:number){
    return this.http.get<UserDto[]>(
      'http://localhost:5000/api/activity/users/'+ id,
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }

  updateActivity(activity:Activity){
    return this.http.put(
      'http://localhost:5000/api/activity/users/'+ activity.id,
      activity,
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }
}
