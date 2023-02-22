import {ActionStrategy} from "../action-strategy";
import {Injectable, NgZone} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class ManageActivitiesStrategy extends ActionStrategy {

  constructor(private router:Router, private zone:NgZone) {
    super();
    this.mapStartSignal= 'manage activities';

    this.mapEndSignal='';

    this.mapInitResponse= 'Navigating to manage activities page';

    this.mapActionDone= '';

    this.pageLink= '';
  }


  runAction(input: string): boolean {
    this.zone.run(()=>{
      this.router.navigate(['/activities']);
    })
    return false;
  }
}
