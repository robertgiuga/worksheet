import {Injectable, NgZone} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionContext} from "./action-context";
import {Observable, Subject} from "rxjs";


declare var webkitSpeechRecognition: any;


@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  private recognition = new webkitSpeechRecognition();
  private isRecording = false;
  private transcript = '';
  public transcriptSubject = new Subject<string>();


  constructor() {
    this.recognition.onresult = this.onResult.bind(this);
    this.recognition.onerror =(event)=> this.onError(event);
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
  }

  start() {
    if (!this.isRecording) {
      this.recognition.start();
      this.isRecording = true;
    }
  }

  stop() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
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

  onError :(event)=>any;

}
