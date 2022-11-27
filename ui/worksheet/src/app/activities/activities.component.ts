import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Activity} from "../../model/Activity";
import {ActivityService} from "./activity.service";
import {UserDto} from "../../model/UserDto";
import {UserService} from "../employees/user.service";
import {User} from "../../model/User";
import {NgForm} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";


interface ActivityUser extends UserDto {
  isHaving: boolean
}

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  datasource: Activity[] = [];
  isError: boolean = false;
  isAddError: boolean = false;
  isActivityError: boolean = false;
  isFetching: boolean = false;
  isAddFetching: boolean = false;
  isActivityFetching: boolean = false;
  displayedColumns: string[] = ['position', 'name', 'description', 'actions'];
  selectedActivity: Activity = {};
  activityUsers: ActivityUser[] = [];
  addActivityUsers: ActivityUser[] = [];


  constructor(private modalService: NgbModal,
              private activityService: ActivityService,
              private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isFetching = true;
    this.activityService.getActivities().subscribe(value => {
      this.datasource = value;
      this.isFetching = false;
    }, () => {
      this.isError = true;
      this.isFetching = false;
    })
  }

  onEdit(content, selectedActivity) {
    this.isActivityFetching = true;
    this.selectedActivity = selectedActivity;
    this.activityUsers = [];
    this.activityService.getActivityUsers(selectedActivity.id).subscribe(
      value => {
        this.activityUsers = value.map(value1 => <ActivityUser>({...value1, isHaving: true}))
        this.userService.getUserDtos().subscribe(
          value => {
            this.activityUsers = this.activityUsers.concat(value
              .filter(value => !this.activityUsers.find(value1 => value1.email == value.email))
              .map(value1 => <ActivityUser>({...value1, isHaving: false})))
            this.isActivityFetching = false;
          }, () => {
            this.isActivityFetching = false;
            this.isActivityError = true
          }
        );
      }, () => {
        this.isActivityFetching = false;
        this.isActivityError = true
      }
    );
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then().catch(()=>{});
  }

  onDelete(content, selectedActivity) {
    this.selectedActivity = selectedActivity;
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then().catch(() => this.selectedActivity = {})
  }

  onAdd(content) {
    this.addActivityUsers = [];
    this.isAddFetching = true;
    this.userService.getUserDtos().subscribe(
      value => {
        this.addActivityUsers =
          value.map(value1 => <ActivityUser>({...value1, isHaving: false}))
        this.isAddFetching = false;
      }, () => {
        this.isAddFetching = false;
        this.isAddError = true
      }
    );
    this.modalService.open(content, {
      centered: true,
      size: 'sm'
    }).result.then().catch(() => this.selectedActivity = {})
  }

  updateActivity(updateForm: NgForm) {
    const newActivityUsers = this.activityUsers.filter(value1 => value1.isHaving);
    const updateActivity = this.selectedActivity;
    updateActivity.name = updateForm.value.name;
    updateActivity.description = updateForm.value.description;
    updateActivity.users = newActivityUsers.map(value1 => <User>{id: value1.id});
    console.log(updateActivity);
    this.activityService.updateActivity(updateActivity).subscribe(() => {
        this.snackBar.open("Activity updated successfully", "Ok");
      },
      () => this.snackBar.open("Some error occurred", "Ok")
    );
  }

  deleteActivity(id: number) {
    this.activityService.deleteActivity(id).subscribe(() => {
        this.datasource = this.datasource.filter(value1 => value1.id != id);
        this.snackBar.open("Activity deleted successfully", "Ok");
      },
      () => {
        this.snackBar.open("Some error occurred", "Ok");
      }
    );
  }

  addActivity(addForm: NgForm) {
    let activity: Activity = {
      name: addForm.value.name,
      description: addForm.value.description,
      users: this.addActivityUsers.filter(value => value.isHaving).map(value => <UserDto>{id: value.id})
    };
    this.activityService.addActivity(activity).subscribe(value => {
      this.datasource = [...this.datasource, value];
      this.snackBar.open("Activity added successfully", "Ok");
    }, () => {
      this.snackBar.open("Some error occurred", "Ok");
    });
  }

}
