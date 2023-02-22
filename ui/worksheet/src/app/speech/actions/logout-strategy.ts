import {ActionStrategy} from "../action-strategy";
import {Injectable} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LogoutStrategy extends ActionStrategy {
  public transcriptSubject = new Subject<string>();

  constructor(private speechSynthesizer: SpeechSynthesizerService) {
    super();
    this.mapStartSignal= 'logout';

    this.mapEndSignal='';

    this.mapInitResponse= 'Logout from app';

    this.mapActionDone= '';

    this.pageLink= '';
  }


  runAction(input: string): boolean {
    this.transcriptSubject.next(input);
    if (this.transcriptSubject.observers.length===0)
      return false;
    return true;
  }
}
