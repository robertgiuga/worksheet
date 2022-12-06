import {Component, OnInit} from '@angular/core';
import {Activity} from "../../model/Activity";
import {User} from "../../model/User";
import {UserService} from "./user.service";
import {NgForm} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivityService} from "../activities/activity.service";

interface ActivityUser extends Activity {
  isHaving: boolean
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  isError: boolean = false;
  isFetching: boolean = false;
  datasource: User[] = [];
  displayedColumns: string[] = ['position', 'name', 'email', 'actions'];
  selectedUser: User = {};
  isActivityError: boolean = false;
  isActivityFetching: boolean = false;
  userActivities: ActivityUser[];

  constructor(private modalService: NgbModal,
              private userService: UserService,
              private activityService: ActivityService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isFetching = true;
    this.userService.getUsers().subscribe(value => {
        this.datasource = value;
        this.isFetching = false;
        this.isError = false
      },
      () => {
        this.isError = true;
        this.isFetching = false
      });
  }

  onEdit(content, selected) {
    this.userActivities = [];
    this.selectedUser = selected;
    this.isActivityFetching = true;
    this.userService.getUserActivities(selected.id).subscribe(value => {
      this.userActivities = value.map(value1 => <ActivityUser>({...value1, isHaving: true}))
      this.activityService.getActivities().subscribe(value => {
        this.userActivities = this.userActivities
          .concat(value.filter(value1 => !this.userActivities.find(value2 => value2.id == value1.id))
            .map(value1 => <ActivityUser>({...value1, isHaving: false})));
        this.isActivityFetching = false;
      }, () => {
        this.isActivityFetching = false;
        this.isActivityError = true
      })
    }, () => {
      this.isActivityFetching = false;
      this.isActivityError = true;
    });
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then().catch(() => {
    });
  }

  onAdd(content) {
    this.userActivities = [];
    this.isActivityFetching = true;
    this.activityService.getActivities().subscribe(value => {
      this.userActivities = value.map(value1 => <ActivityUser>({...value1, isHaving: false}));
      this.isActivityFetching = false;
    }, () => {
      this.isActivityFetching = false;
      this.isActivityError = true
    })
    this.modalService.open(content, {
      centered: true,
      size: 'sm'
    }).result.then().catch(() => this.selectedUser = {})
  }

  updateUser(updateForm: NgForm) {
    const newActivities = this.userActivities.filter(value => value.isHaving);
    let updateUser = this.selectedUser;
    updateUser.email = updateForm.value.email;
    updateUser.givenName = updateForm.value.givenName;
    updateUser.surname = updateForm.value.surname;
    updateUser.role= updateForm.value.role;
    updateUser.displayName = updateUser.givenName + " " + updateUser.surname;
    this.userService.updateUser(updateUser, newActivities).subscribe(
      () => this.snackBar.open("User updated successfully", "Ok", {duration: 2000})
      , () => this.snackBar.open("Some error occurred", "Ok", {duration: 2000}));
  }

  addUser(addForm: NgForm) {
    const userActivities = this.userActivities.filter(value => value.isHaving);
    let user: User = {
      surname: addForm.value.surname,
      givenName: addForm.value.givenName,
      email: addForm.value.email,
      role: addForm.value.role
    }
    this.userService.addUser(user,userActivities).subscribe(
      value => {this.datasource= [...this.datasource, value]; this.snackBar.open("User added successfully", "Ok",{duration: 2000});},
      () => this.snackBar.open("Some error occurred", "Ok",{duration: 2000}));
  }


}
