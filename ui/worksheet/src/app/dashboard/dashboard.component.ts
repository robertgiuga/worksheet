import {Component, OnInit} from '@angular/core';
import {Activity} from "../../model/Activity";
import {UserService} from "../employees/user.service";
import {forkJoin} from "rxjs";
import {HolidayService} from "../holiday-requests/holiday.service";

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
  usedHolidayDays:number=0;
  totalHolidayDays:number=0;

  constructor(private userService: UserService, private holidayService: HolidayService) {
  }

  ngOnInit(): void {
    this.isFetching = true;
    let activities =this.userService.getLoggedUserActivities();
    let hours=this.userService.getHours();
    let holidayDays= this.holidayService.getUserHolidayDays();
    forkJoin([activities, hours,holidayDays]).subscribe(value=>{
      this.isFetching = false;
      this.isError = false;
      this.datasource= value[0];
      // @ts-ignore
      this.totalHours = value[1].totalHours;
      // @ts-ignore
      this.extraHours = value[1].extraHours;
      // @ts-ignore
      this.workedHours = value[1].workedHours;
      // @ts-ignore
      this.totalHolidayDays= value[2].totalDays;
      // @ts-ignore
      this.usedHolidayDays= value[2].usedDays

    }, ()=>{
      this.isFetching = false;
      this.isError = true;
    });
  }

}
