import {Component, OnInit} from '@angular/core';
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
  isLoading: boolean = true;
  datasource: Holiday[] = [];
  displayedColumns: string[] = ['position', 'name', 'email', 'interval', 'actions'];

  constructor(private holidayService: HolidayService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.holidayService.getPendingHolidayRequests().subscribe((value) =>{ this.datasource= value; this.isLoading=false}, () => {
      this.snackBar.open("Some error occurred", "Ok", {duration: 2000})
      this.isError=true;
    })
  }

  onAccept(element: Holiday) {
    if(element.id) {
      this.holidayService.acceptHolidayRequest(element.id).subscribe(()=>{
        this.datasource= this.datasource.filter(h=>h.id!=element.id);
      }, ()=>{ this.snackBar.open("Some error occurred", "Ok", {duration: 2000})})
    }
  }

  onDecline(element: Holiday) {
    if(element.id) {
      this.holidayService.declineHolidayRequest(element.id).subscribe(()=>{
        this.datasource= this.datasource.filter(h=>h.id!=element.id);
      }, ()=>{ this.snackBar.open("Some error occurred", "Ok", {duration: 2000})})
    }
  }
}
