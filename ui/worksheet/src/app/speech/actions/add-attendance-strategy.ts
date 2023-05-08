import {ActionStrategy} from "../action-strategy";
import {Injectable, NgZone} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AddAttendanceStrategy extends ActionStrategy {
  public observable= new Observable<string>();
  private subscriber;

  constructor(private router:Router) {
    super();
    this.mapStartSignal= 'add attendance';

    this.mapEndSignal='save';

    this.mapInitResponse= 'Adding a new attendance';

    this.mapFinishResponse= 'Added the attendance';

    this.pageLink= "/calendar";

    this.observable= new Observable<string>((subs)=>{
      this.subscriber=subs;
    })
  }


  runAction(input: string):boolean {
    if(this.router.url==this.pageLink)
      this.subscriber.next(input);
    if(input===this.mapFinishResponse)
      return false;
    return true;
  }
}
