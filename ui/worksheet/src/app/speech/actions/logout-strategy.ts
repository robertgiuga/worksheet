import {ActionStrategy} from "../action-strategy";
import {Injectable} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LogoutStrategy extends ActionStrategy {
  public transcriptSubject = new Subject<string>();

  constructor() {
    super();
    this.mapStartSignal= 'logout from app';

    this.mapInitResponse= 'Logging out from app';

  }


  runAction(input: string):boolean {
    this.transcriptSubject.next(input);
    return false;
  }

}
