import { Injectable } from '@angular/core';
import {SpeechRecognitionService} from "./speech-recognition.service";

@Injectable({
  providedIn: 'root',
})
export class SpeechSynthesizerService {
  speechSynthesizer!: SpeechSynthesisUtterance;
  language = 'en-US';

  constructor(private speechRecognition: SpeechRecognitionService) {
    this.initSynthesis();
    this.speechSynthesizer.onstart=(event)=>{
      this.speechRecognition.stop();
    }
    this.speechSynthesizer.onend=(event)=>{
      this.speechRecognition.start();
    }
  }

  initSynthesis(): void {
    this.speechSynthesizer = new SpeechSynthesisUtterance();
    this.speechSynthesizer.volume = 1;
    this.speechSynthesizer.rate = 1;
    this.speechSynthesizer.pitch = 1;
  }

  speak(message: string): void {
    this.speechSynthesizer.lang = this.language;
    this.speechSynthesizer.text = message;
    speechSynthesis.speak(this.speechSynthesizer);
  }
}
