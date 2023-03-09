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
  totalHours: number = 0;
  workedHours: number = 0;
  extraHours: number = 0;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.isFetching = true;
    this.userService.getLoggedUserActivities().subscribe(value => {
        this.datasource = value;
        this.userService.getHours().subscribe(value => {
            this.isFetching = false;
            this.isError = false;
            // @ts-ignore
            this.totalHours = value.totalHours;
            // @ts-ignore
            this.extraHours = value.extraHours;
            // @ts-ignore
            this.workedHours = value.workedHours;

          },
          () => {
            this.isFetching = false;
            this.isError = true;
          })
      },
      () => {
        this.isFetching = false;
        this.isError = true;
      }
    );
  }

}
