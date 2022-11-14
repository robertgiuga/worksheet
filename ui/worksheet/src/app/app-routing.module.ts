import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {CalendarComponent} from "./calendar/calendar.component";

const routes: Routes = [
  {path:'login', component:AuthComponent},
  {path:'calendar', component:CalendarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
