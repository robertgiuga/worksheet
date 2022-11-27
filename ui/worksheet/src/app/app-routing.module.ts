import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {WrapperComponent} from "./wrapper/wrapper.component";
import {EmployeesComponent} from "./employees/employees.component";
import {ActivitiesComponent} from "./activities/activities.component";
import {AuthGuard} from "./auth/auth.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  {path:'login', component:AuthComponent},
  { path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    children:[
      { path: 'calendar', component: CalendarComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'manage-employees', component: CalendarComponent },
      // { path: 'reports', component: ReportsComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'activities', component: ActivitiesComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
