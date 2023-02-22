import {ActionStrategy} from "../action-strategy";
import {Injectable, NgZone} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class DashboardStrategy extends ActionStrategy {

  constructor(private router:Router, private zone:NgZone) {
    super();
    this.mapStartSignal= 'dashboard';

    this.mapEndSignal='';

    this.mapInitResponse= 'Navigating to Dashboard page';

    this.mapActionDone= '';

    this.pageLink= '';
  }


  runAction(input: string): boolean {
    this.zone.run(()=>{
      this.router.navigate(['/dashboard']);
    })
    return false;
  }
}
