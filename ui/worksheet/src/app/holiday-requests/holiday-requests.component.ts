import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {Holiday} from "../../model/Holiday";
import {HolidayService} from "./holiday.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-holiday-requests',
  templateUrl: './holiday-requests.component.html',
  styleUrls: ['./holiday-requests.component.css']
})
export class HolidayRequestsComponent implements OnInit {
  isError: boolean = false;
  isLoading: boolean = false;
  datasource: Holiday[] = [];
  displayedColumns: string[] = ['position', 'name', 'email', 'interval', 'actions'];

  constructor(private holidayService: HolidayService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.holidayService.getPendingHolidayRequests().subscribe((value) => this.datasource= value, (err) => {
      this.snackBar.open("Some error occurred", "Ok", {duration: 2000})
    })
  }

  onAccept(element: Holiday) {

  }

  onDecline(element: Holiday) {

  }
}
