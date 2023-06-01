import {SpeechRecognitionService} from "./speech-recognition.service";
import {ActionContext} from "./action-context";
import {SpeechSynthesizerService} from "./speech-synthesizer.service";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class AssistantService {

  private endRecognition: boolean= false;

  constructor( private speechRecognition: SpeechRecognitionService,
               private actionContext: ActionContext,
               private SpeechSynthesizerService: SpeechSynthesizerService,
               private snackBar: MatSnackBar) {
    this.SpeechSynthesizerService.onStart=()=>{
        this.speechRecognition.stop();
        console.log("--")
    }
    this.SpeechSynthesizerService.onEnd=()=>{
      if(!this.endRecognition)
          this.speechRecognition.start();
      console.log("--")
    }
    this.speechRecognition.transcriptSubject.subscribe(value =>
      this.actionContext.processMessage(value)
    )

    this.speechRecognition.onError=(event)=>{
      console.log(event);
      switch (event.error){
        case 'no-speech':
          this.snackBar.open('Error: No speech detected', 'Close');
          break;
        case 'audio-capture':
          this.snackBar.open('Error: No microphone found', 'Close');
          break;
        case 'not-allowed':
          this.snackBar.open('Error: Microphone permission denied', 'Close');
          break;
        default:
          this.snackBar.open('Error: Some error happened with the assistant', 'Close');
      }
    }
  }

  start(){
    this.endRecognition= false;
    this.speechRecognition.start();
  }

  stop(){
    this.endRecognition=true;
    this.speechRecognition.stop();
  }
}
