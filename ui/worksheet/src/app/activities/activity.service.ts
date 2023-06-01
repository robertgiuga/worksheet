import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Activity} from "../../model/Activity";
import {AuthService} from "../auth/auth.service";
import {UserLogin} from "../../model/UserLogin";
import {User} from "../../model/User";

@Injectable({providedIn:'root'})
export class ActivityService{
  user:UserLogin={};
  constructor(private http: HttpClient, private authService:AuthService) {
    authService.user.subscribe(value => this.user=value);
  }

  getActivities(){
    return this.http.get<Activity[]>(
      'http://localhost:5000/api/activity',
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})});
  }

  getActivityUsers(id:number){
    return this.http.get<User[]>(
      'http://localhost:5000/api/activity/users/'+ id,
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }

  updateActivity(activity:Activity){
    return this.http.put<Activity>(
      'http://localhost:5000/api/activity/'+ activity.id,
      activity,
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }

  deleteActivity(activityId: number){
    return this.http.delete(
      'http://localhost:5000/api/activity/'+ activityId,
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }

  addActivity(activity: Activity){
    return this.http.post<Activity>(
      'http://localhost:5000/api/activity/',
      {
        Name: activity.name,
        Description: activity.description,
        Users: activity.users
      },
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
      )
  }
}
