import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {WrapperComponent} from "./wrapper/wrapper.component";

const routes: Routes = [
  {path:'login', component:AuthComponent},
  { path: '',
    component: WrapperComponent,
    canActivate: [],
    children:[
      { path: 'calendar', component: CalendarComponent },
    ]
  },
  { path: '',
    component: WrapperComponent,
    canActivate: [],
    children:[
      { path: 'manage-employees', component: CalendarComponent },
      { path: 'reports', component: CalendarComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
