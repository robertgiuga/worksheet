import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Activity} from "../../model/Activity";
import {ActivityService} from "./activity.service";
import {UserDto} from "../../model/UserDto";
import {UserService} from "../employees/user.service";
import {User} from "../../model/User";
import {NgForm} from "@angular/forms";


interface ActivityUser extends UserDto{
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
  isFetching:boolean= false;
  displayedColumns: string[] = ['position', 'name', 'description', 'actions'];
  selectedActivity: Activity = {};
  activityUsers: ActivityUser[]=[];
  nonActivityUsers:ActivityUser[]= [];

  constructor(private modalService: NgbModal, private activityService: ActivityService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.isFetching= true;
    this.activityService.getActivities().subscribe(value => {this.datasource = value; this.isFetching= false;}, error => {
      this.isError = true;
      this.isFetching= false;
    })
  }

  onEdit(content, selectedActivity) {
    this.selectedActivity= selectedActivity;
    this.nonActivityUsers = [];
    this.activityUsers = [];

    this.activityService.getActivityUsers(selectedActivity.id).subscribe(
      value => this.activityUsers= value.map(value1=> <ActivityUser>({...value1, isHaving : true}))
    );
    this.userService.getUserDtos().subscribe(
      value => this.nonActivityUsers= value
        .filter(value => !this.activityUsers.find(value1 => value1.email==value.email))
        .map(value1=> <ActivityUser>({...value1, isHaving : false}))
    );

    this.modalService.open(content, {centered: true, size: 'sm'}).result.then(
      value => {
        if(value=='Save'){
          const newUser= this.activityUsers.filter(value1 => value1.isHaving)
            .concat(this.nonActivityUsers.filter(value1 => value1.isHaving));
          const updateActivity= this.selectedActivity;
          updateActivity.users= newUser.map(value1 =><User> {id: value1.id});
          //this.activityService.updateActivity(this.selectedActivity);
        }
        else if(value=='Delete'){

        }
      }
    ).catch(reason => {})
  }

  onDelete(content, selectedActivity) {
    this.selectedActivity = selectedActivity;
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then(
      value => {
        console.log(value);
        this.selectedActivity = {};
      }
    ).catch(reason => this.selectedActivity = {})
  }

}
