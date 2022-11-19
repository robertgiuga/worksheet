import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {User} from "../../model/User";


export interface AuthResponseData {
  token: string;
  expiresIn: string;
  fullName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user= new BehaviorSubject<User>({});
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    let myHeaders= new HttpHeaders();
    myHeaders.append("Content-Type","application/json");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:5000');
    return this.http
      .post<AuthResponseData>(
        'http://localhost:5000/api/authenticate',
        {
          Email: email,
          Password: password,
        },
        {headers: myHeaders}
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            email,
            resData.token,
            +resData.expiresIn,
            resData.fullName,
            resData.role
          );
        })
      );
  }

  autoLogin() {
    if (!localStorage.getItem('userData')) {
      return;
    }
    const userData: {
      email: string;
      token: string;
      tokenExpirationDate: string;
      fullName: string;
      role: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    const loadedUser:User=
    {
      email: userData.email,
      token:  userData.token,
      tokenExpirationDate: new Date(userData.tokenExpirationDate),
      fullName: userData.fullName,
      role: userData.role
    };
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next({});
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email:string,
    token: string,
    expiresIn: number,
    fullName: string,
    role: string
  ) {
    const expirationDate = new Date(Date.now() + expiresIn*60000);
    const user:User = {email, token: token, tokenExpirationDate: expirationDate, fullName:fullName, role:role};
    this.user.next(user);
    this.autoLogout(expiresIn*60000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(()=>errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(()=>errorMessage);
  }
  checkTokenExist(){
    return localStorage.getItem('userData');

  }
}
