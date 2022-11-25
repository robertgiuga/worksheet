import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserDto} from "../../model/UserDto";
import {AuthService} from "../auth/auth.service";
import {User} from "../../model/User";

@Injectable({providedIn: 'root'})
export class UserService{
  user:User={}
  constructor(private http: HttpClient, private authService :AuthService) {
    authService.user.subscribe(value => this.user=value);
  }

  getUserDtos(){
    return this.http.get<UserDto[]>(
      'http://localhost:5000/api/user',
      {headers: new HttpHeaders({'Authorization': 'Bearer '+ this.user.token})}
    );
  }
}
