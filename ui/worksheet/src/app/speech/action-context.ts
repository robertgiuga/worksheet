import {Injectable, NgZone} from "@angular/core";
import {ActionStrategy} from "./action-strategy";
import {bottom, end} from "@popperjs/core";
import {SpeechSynthesizerService} from "./speech-synthesizer.service";
import {AddAttendanceStrategy} from "./actions/add-attendance-strategy";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {LogoutStrategy} from "./actions/logout-strategy";
import {HomeStrategy} from "./actions/home-strategy";
import {ManageActivitiesStrategy} from "./actions/manage-activities-strategy";
import {ManageEmployeesStrategy} from "./actions/manage-employees-strategy";
import {DashboardStrategy} from "./actions/dashboard-strategy";

@Injectable({
  providedIn: 'root',
})
export class ActionContext {
  private currentStrategy?: ActionStrategy;
  private strategyList: ActionStrategy[];
  private playAlert;


  constructor(
    private router: Router,
    private zone: NgZone,
    private speechSynthesizer: SpeechSynthesizerService,
    private addAttendanceStrategy: AddAttendanceStrategy,
    private logoutStrategy: LogoutStrategy,
    private homeStrategy: HomeStrategy,
    private manageActivitiesStrategy: ManageActivitiesStrategy,
    private manageEmployeesStrategy: ManageEmployeesStrategy,
    private dashBoardStrategy: DashboardStrategy
  ) {
    this.strategyList = [addAttendanceStrategy, logoutStrategy, homeStrategy, manageEmployeesStrategy, manageActivitiesStrategy, dashBoardStrategy];
    this.playAlert = require('alert-sound-notify')
    this.playAlert.volume(0.5);
  }

  processMessage(message: string): void {
    console.log(message);
    const msg = message.toLowerCase();
    const hasChangedStrategy = this.hasChangedStrategy(msg);

    if (this.currentStrategy == undefined) {
      console.log("**")
      this.playAlert('purr');
    }
    let isFinishSignal = false;
    if (!hasChangedStrategy) {
      isFinishSignal = this.isFinishSignal(msg);
    }
    if (!isFinishSignal) {
      this.runAction(message);
    }

  }

  runAction(input: string): void {
    if (this.currentStrategy) {
      let response = this.currentStrategy.runAction(input);
      if (!response) {
        this.setStrategy(undefined);
      }
    }
  }

  setStrategy(strategy: ActionStrategy | undefined): void {
    this.currentStrategy = strategy;
  }

  private hasChangedStrategy(message: string): boolean {
    let strategy: ActionStrategy | undefined;
    this.strategyList.forEach(value => {
      if (message === value.getStartSignal()) {
        strategy = value;
      }
    });
    if (strategy) {
      this.setStrategy(strategy);
      this.speechSynthesizer.speak(
        strategy.getInitialResponse());
      return true;
    }

    return false;
  }

  private isFinishSignal(message: string): boolean {
    let endSignal: boolean = false;
    this.strategyList.forEach(value => {
      if (message === value.getEndSignal()) {
        endSignal = true;
      }
    });
    if (endSignal) {
      if (this.currentStrategy) {
        this.speechSynthesizer.speak(
          this.currentStrategy.getFinishResponse());
      }
      this.setStrategy(undefined);
      return true;
    }

    return false;
  }

  stopStrategy(startSignal: string) {
    if (this.currentStrategy?.getStartSignal() === startSignal)
      this.currentStrategy = undefined;
  }
}
