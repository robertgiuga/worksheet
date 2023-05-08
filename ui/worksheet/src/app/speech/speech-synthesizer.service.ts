import {Injectable} from '@angular/core';
import {SpeechRecognitionService} from "./speech-recognition.service";

@Injectable({
  providedIn: 'root',
})
export class SpeechSynthesizerService {
  private speechSynthesizer!: SpeechSynthesisUtterance;
  private language = 'en-US';

  constructor() {
    this.initSynthesis();
    this.speechSynthesizer.onstart = (event) => this.onStart();
    this.speechSynthesizer.onend = (event) => this.onEnd();
  }

  initSynthesis(): void {
    this.speechSynthesizer = new SpeechSynthesisUtterance();
    this.speechSynthesizer.volume = 1;
    this.speechSynthesizer.rate = 1;
    this.speechSynthesizer.pitch = 1;
    this.speechSynthesizer.lang = this.language;
  }

  speak(message: string): void {
    this.speechSynthesizer.text = message;
    speechSynthesis.speak(this.speechSynthesizer);
  }

  onStart:(() => any);

  onEnd: (() => any);
}
