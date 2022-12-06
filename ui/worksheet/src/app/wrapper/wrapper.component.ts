import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDrawerMode} from "@angular/material/sidenav";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {UserLogin} from "../../model/UserLogin";

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {

  @ViewChild("sidenav", {static: false}) sidenav;
  sidenavMode: MatDrawerMode = "side";
  user: UserLogin = {};
  username: string = ""

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
        this.user = user;
        this.username = user.fullName ? user.fullName : "";
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (event.target.innerWidth < 800) {
      this.sidenav.close();
      this.sidenavMode = "over";
    }
    if (event.target.innerWidth > 800) {
      this.sidenav.open();
      this.sidenavMode = "side";
    }
  }

  logOut() {
    this.authService.logout();
  }

}
