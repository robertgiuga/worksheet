import {ActionStrategy} from "../action-strategy";
import {Injectable, NgZone} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class HolidayStrategy extends ActionStrategy {

  constructor(private router:Router, private zone:NgZone) {
    super();
    this.mapStartSignal= 'navigate to holiday page';

    this.mapInitResponse= 'Navigating to Holiday page';

    this.pageLink= '/holiday-requests';
  }


  runAction(input: string): boolean {
    this.zone.run(()=>{
      this.router.navigate([this.pageLink]);
    })
    return false;
  }

}
