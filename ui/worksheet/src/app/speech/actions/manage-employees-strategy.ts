import {ActionStrategy} from "../action-strategy";
import {Injectable, NgZone} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class ManageEmployeesStrategy extends ActionStrategy {

  constructor(private router:Router, private zone:NgZone) {
    super();
    this.mapStartSignal= 'navigate to manage employees page';

    this.mapInitResponse= 'Navigating to manage employees page';

    this.pageLink= '/employees';
  }


  runAction(input: string): boolean {
    this.zone.run(()=>{
      this.router.navigate([this.pageLink]);
    })
    return false;
  }

}
