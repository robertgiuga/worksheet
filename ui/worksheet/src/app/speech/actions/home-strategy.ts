import {ActionStrategy} from "../action-strategy";
import {Injectable, NgZone} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class HomeStrategy extends ActionStrategy {

  constructor(private router:Router, private zone:NgZone) {
    super();
    this.mapStartSignal= 'navigate to home page';

    this.mapInitResponse= 'Navigating to Home page';

    this.pageLink= '/calendar';
  }


  runAction(input: string): boolean {
    this.zone.run(()=>{
      this.router.navigate([this.pageLink]);
    })
    return false;
  }

}
