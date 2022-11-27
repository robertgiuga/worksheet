import { Component, OnInit } from '@angular/core';
import {Activity} from "../../model/Activity";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  isError: boolean = false;
  isFetching: boolean = false;
  datasource: Activity[] = [];
  displayedColumns: string[] = ['position', 'name', 'email', 'contractDate', 'actions'];
  constructor() { }

  ngOnInit(): void {
  }

}
