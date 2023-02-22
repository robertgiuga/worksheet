import {ChangeDetectorRef, Component, HostListener, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatDrawerMode} from "@angular/material/sidenav";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {UserLogin} from "../../model/UserLogin";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SpeechRecognitionService} from "../speech/speech-recognition.service";
import {map, merge, Observable, of, Subject} from "rxjs";
import {ActionContext} from "../speech/action-context";
import {tap} from "rxjs/operators";
import {SpeechError, SpeechEvent, SpeechNotification} from "../speech/shared";
import {LogoutStrategy} from "../speech/actions/logout-strategy";

declare var webkitSpeechRecognition: any;


@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {

  @ViewChild("sidenav", {static: false}) sidenav;
  sidenavMode: MatDrawerMode = "side";
  user: UserLogin = {};
  username: string = ""
  logOutSubscription;
  public isRecording = false;

  constructor(private router: Router,
              private speechRecognition: SpeechRecognitionService,
              private actionContext: ActionContext,
              private zone: NgZone,
              private cdr: ChangeDetectorRef,
              private logOutStrategy: LogoutStrategy,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
        this.user = user;
        this.username = user.fullName ? user.fullName : "";
      }
    );
    this.speechRecognition.transcriptSubject.subscribe(value =>
      this.actionContext.processMessage(value)
    )
    this.speechRecognition.startEndSubject.subscribe(value => {
      if(value==='end') {
        this.isRecording = false;
        this.cdr.detectChanges();
      }
      else{
        this.isRecording = true;
        this.cdr.detectChanges();
      }
    });
    this.logOutSubscription= this.logOutStrategy.transcriptSubject.subscribe(value => {
      if (value === this.logOutStrategy.getStartSignal()) {
        this.zone.run(() => {
          this.logOut();
        })
      }
    })
  }

  ngOnDestroy():void{
    this.logOutSubscription.unsubscribe();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (event.target.innerWidth < 800) {
      this.sidenav.close();
      this.sidenavMode = "over";
    }
    if (event.target.innerWidth > 800) {
      this.sidenav.open();
      this.sidenavMode = "side";
    }
  }

  onToggleRecognition() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.speechRecognition.start();
    } else {
      this.speechRecognition.stop();
    }
  }

  logOut() {
    this.authService.logout();
  }

}
