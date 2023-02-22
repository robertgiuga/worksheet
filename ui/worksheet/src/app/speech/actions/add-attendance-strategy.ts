import {ActionStrategy} from "../action-strategy";
import {Injectable} from "@angular/core";
import {SpeechSynthesizerService} from "../speech-synthesizer.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AddAttendanceStrategy extends ActionStrategy {
  public transcriptSubject = new Subject<string>();

  constructor(private speechSynthesizer: SpeechSynthesizerService) {
    super();
    this.mapStartSignal= 'add attendance';

    this.mapEndSignal='finish attendance';

    this.mapInitResponse= 'Adding a new attendance';

    this.mapActionDone= 'Added the attendance';

    this.pageLink= "/calendar";
  }


  runAction(input: string): boolean {
    this.transcriptSubject.next(input);
    if (this.transcriptSubject.observers.length===0)
      return false;
    return true;
  }
}
