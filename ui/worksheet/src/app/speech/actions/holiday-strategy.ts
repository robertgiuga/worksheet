import {ActionStrategy} from "../action-strategy";
import {Injectable, NgZone} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class HolidayStrategy extends ActionStrategy {

  constructor(private router:Router, private zone:NgZone) {
    super();
    this.mapStartSignal= 'holiday';

    this.mapEndSignal='';

    this.mapInitResponse= 'Navigating to Holiday page';

    this.mapActionDone= '';

    this.pageLink= '';
  }


  runAction(input: string): boolean {
    this.zone.run(()=>{
      this.router.navigate(['/holiday-requests']);
    })
    return false;
  }
}
