import {Injectable, NgZone} from "@angular/core";
import {ActionStrategy} from "./action-strategy";
import {SpeechSynthesizerService} from "./speech-synthesizer.service";
import {AddAttendanceStrategy} from "./actions/add-attendance-strategy";
import {Router} from "@angular/router";
import {LogoutStrategy} from "./actions/logout-strategy";
import {HomeStrategy} from "./actions/home-strategy";
import {ManageActivitiesStrategy} from "./actions/manage-activities-strategy";
import {ManageEmployeesStrategy} from "./actions/manage-employees-strategy";
import {DashboardStrategy} from "./actions/dashboard-strategy";
import {HolidayStrategy} from "./actions/holiday-strategy";

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
    private dashBoardStrategy: DashboardStrategy,
    private holidayStrategy: HolidayStrategy
  ) {
    this.strategyList = [addAttendanceStrategy, logoutStrategy, homeStrategy, manageEmployeesStrategy, manageActivitiesStrategy, dashBoardStrategy, holidayStrategy];
    this.playAlert = require('alert-sound-notify')
    this.playAlert.volume(0.5);
  }


  processMessage(message: string): void {
    console.log(message);
    const msg = message.toLowerCase();
    this.hasChangedStrategy(msg);

    if (this.currentStrategy == undefined) {
      console.log("no strategy")
      this.playAlert('purr');
    }
    this.runAction(message);
    this.isFinishSignal(msg);

  }

  runAction(input: string): void {
    if (this.currentStrategy) {
      const val= this.currentStrategy.runAction(input);
      if(!val)
        this.setStrategy(undefined);
    }
  }

  setStrategy(strategy: ActionStrategy | undefined): void {
    this.currentStrategy = strategy;
  }

  private hasChangedStrategy(message: string) {
    let strategy: ActionStrategy | undefined;
    this.strategyList.forEach(value => {
      if (message === value.getStartSignal()) {
        strategy = value;
      }
    });
    if (strategy) {
      this.setStrategy(strategy);
      if (strategy.getInitialResponse() != null) {
        // @ts-ignore
        this.speechSynthesizer.speak(strategy.getInitialResponse());
      }
    }
  }

  private isFinishSignal(message: string) {
    let endSignal: boolean = message === this.currentStrategy?.getEndSignal();
    if (endSignal) {
      if (this.currentStrategy && this.currentStrategy.getFinishResponse() != null) {
        // @ts-ignore
        this.speechSynthesizer.speak(this.currentStrategy.getFinishResponse());
      }
      this.setStrategy(undefined);
    }
  }

  stopCurrentStrategy() {
    this.currentStrategy = undefined;
  }
}
