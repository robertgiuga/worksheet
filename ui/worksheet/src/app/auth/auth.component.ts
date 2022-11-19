import { Component, OnInit } from '@angular/core';
import {AuthResponseData, AuthService} from "./auth.service";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoading: boolean= false;
  error: string= "";
  constructor(private authService: AuthService, private router:Router){ }

  ngOnInit(): void {
  }

  login(form: NgForm){
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    authObs = this.authService.login(email, password);

    authObs.subscribe(()=>{
        this.isLoading = false;
        this.router.navigate(["/calendar"]);
      }, (error)=>{
        console.log(error);
        this.error = error;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
