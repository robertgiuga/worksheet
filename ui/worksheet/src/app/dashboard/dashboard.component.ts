import {Component, OnInit} from '@angular/core';
import {Activity} from "../../model/Activity";
import {UserService} from "../employees/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isError: boolean = false;
  isFetching: boolean = false;
  datasource: Activity[] = [];
  displayedColumns: string[] = ['position', 'name', 'description'];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.isFetching = true;
    this.userService.getUserActivities().subscribe(value => {
        this.datasource = value;
        this.isFetching = false;
        this.isError = false;
      },
      () => {
        this.isFetching = false;
        this.isError = true;
      }
    );
  }

}
