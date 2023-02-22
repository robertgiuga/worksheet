import {Injectable, NgZone} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionContext} from "./action-context";
import {Subject} from "rxjs";


declare var webkitSpeechRecognition: any;


@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService{
  private recognition = new webkitSpeechRecognition();
  isRecording = false;
  private transcript = '';
  public transcriptSubject= new Subject<string>();
  public startEndSubject= new Subject();

  private endRecognition:boolean;

  constructor(private snackBar: MatSnackBar, private zone:NgZone) {
    this.recognition.onresult = this.onResult.bind(this);
    this.recognition.onerror = this.onError.bind(this);
    this.recognition.onstart=()=>{
      if(this.endRecognition)
        this.recognition.stop();
      else
        this.startEndSubject.next('start');
    }
    this.recognition.onend=(event)=>{
      this.startEndSubject.next('end');
    }
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
  }
  start(){
    if (!this.isRecording) {
      this.recognition.start();
      this.isRecording= true;
    }
  }
  stop(){
    if(this.isRecording){
      this.recognition.stop();
      this.isRecording= false;
    }
  }


  private onResult(event: any): void {
    const result = event.results[event.results.length - 1];
    if (result.isFinal) {
      this.transcript = result[0].transcript.trim();
      console.log(this.transcript);
      this.transcriptSubject.next(this.transcript);
    }
  }

  private onError(event: any): void {
    this.zone.run(()=>{
      this.isRecording= false;
    })
    console.log(event);
    if (event.error === 'no-speech') {
      this.snackBar.open('Error: No speech detected', 'Close');
    }
    if (event.error === 'audio-capture') {
      this.snackBar.open('Error: No microphone found', 'Close');
    }
    if (event.error === 'not-allowed') {
      if (event.timeStamp - (new Date()).getTime() < 100) {
        this.snackBar.open('Error: Microphone permission denied', 'Close');
      } else {
        this.snackBar.open('Error: Microphone permission blocked', 'Close');
      }
    }
  }

  public setEndRecognition(value:boolean){
    this.endRecognition=value;
  }
}
