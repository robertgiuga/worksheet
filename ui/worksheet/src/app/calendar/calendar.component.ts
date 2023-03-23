import {ChangeDetectorRef, Component, NgZone, OnInit, ViewChild,} from '@angular/core';
import {CalendarMonthViewBeforeRenderEvent, CalendarView, collapseAnimation} from "angular-calendar";
import {isSameDay, isSameMonth} from "date-fns";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Activity} from "../../model/Activity";
import {UserService} from "../employees/user.service";
import {FormBuilder, NgForm} from "@angular/forms";
import {Attendance} from "../../model/Attendance";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SpeechSynthesizerService} from "../speech/speech-synthesizer.service";
import {Router} from "@angular/router";
import {AddAttendanceStrategy} from "../speech/actions/add-attendance-strategy";
import {ActionContext} from "../speech/action-context";
import {Holiday} from "../../model/Holiday";
import {HolidayService} from "../holiday-requests/holiday.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  animations: [collapseAnimation]
})
export class CalendarComponent implements OnInit {

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = false;
  CalendarView = CalendarView;
  checkIn = '09:00';
  checkOut = '17:00';
  selectedAttendanceCheckIn: string = '09:00';
  selectedAttendanceCheckOut: string = '17:00';
  userActivities: Activity[];
  isActivityLoading: boolean = false;
  isActivityError: boolean = false
  todayAttendance: Attendance[];
  isAttendanceLoading: boolean = false;
  isAttendanceError: boolean = false;
  selectedAttendance: Attendance;
  questionNr: number = 0;
  comment: string = "";
  activity: Activity;
  transcriptSubject$;
  subscription;
  minDate: Date;
  holidayRequests: Holiday[];
  holidayDays: Holiday[];
  isTodayHoliday:boolean= false;
  isTodayHolidayRequest:boolean= false;
  todayHoliday:Holiday;
  @ViewChild("calendar") calendar;


  constructor(private modalService: NgbModal,
              private userService: UserService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private zone: NgZone,
              private router: Router,
              private snackBar: MatSnackBar,
              private addAttendanceStrategy: AddAttendanceStrategy,
              private actionContext: ActionContext,
              private holidayService: HolidayService,
              private speechSynthesizer: SpeechSynthesizerService) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.transcriptSubject$= this.addAttendanceStrategy.transcriptSubject;
  }
  ngOnDestroy() :void{

    this.subscription.unsubscribe();
    this.modalService.dismissAll();
  }

  ngAfterViewInit(): void {
   this.subscription=this.transcriptSubject$.subscribe(this.attendanceAssistant.bind(this));
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
     this.holidayService.getUserHolidayRequests().subscribe((value)=>{
       this.holidayRequests= value.filter(value1 => value1.status==='pending');
       this.holidayDays= value.filter(value1 => value1.status==='accepted');
       renderEvent.body.forEach((day) => {

         if (this.dateInHoliday(day.date, this.holidayRequests)[0]) {
           day.backgroundColor="#ff4081";
         }
         if (this.dateInHoliday(day.date, this.holidayDays)[0]) {
           day.backgroundColor="cornflowerblue";
         }
       });
     })
  }


  private dateInHoliday(date:Date, holidays:Holiday[]):[boolean,Holiday]{
    let val:boolean= false;
    let holiday:Holiday= {};
    holidays.forEach(h=>{
      // @ts-ignore
      let start= new Date(h.startDate?.split("T")[0]);
      start.setHours(0,0,0);
      // @ts-ignore
      let stop= new Date(h.endDate?.split("T")[0]);
      stop.setHours(0,0,0);
      //TODO improve
       if(start<=date&&date<=stop) {
         val = true;
         holiday= h;
       }
    })
    return [val,holiday];
  }

  private

  notify() {
    console.log("*")
    this.questionNr = 0;
    this.actionContext.stopStrategy(this.addAttendanceStrategy.getStartSignal());
  }

  private attendanceAssistant(value: string) {
    console.log(value);
    if (this.questionNr == 0) {
      this.showPopUpCurrentDayAttendance();
      this.speechSynthesizer.speak("What activity are you doing on today?");
      this.questionNr++;
    } else {
      switch (this.questionNr) {
        case 1:
          const activity = this.userActivities.find(value1 => value1.name?.toLowerCase() === value.toLowerCase());
          if (activity) {
            this.zone.run(() => {
              this.activity = activity;
            })
            this.speechSynthesizer.speak("check in time?");
          } else {
            this.speechSynthesizer.speak("sorry I did not find that please try again");
            this.questionNr--;
          }
          break;
        case 2:
          let isValid = /^([0-1][0-9]):([0-5][0-9])$/.test(value)
          if (isValid) {
            this.zone.run(() => {
              this.checkIn = value;
            });
            this.speechSynthesizer.speak("check out time?");
            break;
          }
          const hourI = value.split(':')[0];
          const minuteI = value.split(':')[1];
          if (+hourI) {
            if (hourI.length === 1) {
              let newValue= "0" + hourI;
              if (+minuteI)
                newValue += ":" + minuteI;
              else
                newValue += ":00"
              isValid = /^([0-1][0-9]):([0-5][0-9])$/.test(newValue)
              if (isValid) {
                this.zone.run(() => {
                  this.checkIn = newValue;
                });
                this.speechSynthesizer.speak("check out time?");
                break;
              }
            }
          }
          this.speechSynthesizer.speak("sorry i could not get that please try again");
          this.questionNr--;
          break;
        case 3:
          let isValid2 = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value)
          if (isValid2) {
            this.zone.run(() => {
              this.checkOut = value;
            });
            this.speechSynthesizer.speak("comment?");
          } else {
            value += ":00";
            isValid2 = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value)
            if (isValid2) {
              this.zone.run(() => {
                this.checkOut = value;
              });
              this.speechSynthesizer.speak("comment?");
            } else {
              this.speechSynthesizer.speak("sorry i could not get that please try again");
              this.questionNr--;
            }
          }
          break;
        case 4:
          this.zone.run(() => {
            this.comment = value
          })
          break;
        case 5:
          if (value === "save") {
            this.questionNr = 0;
            // @ts-ignore
            document.getElementById('save-attendance').click();
            this.subscription.unsubscribe();
          } else
            this.questionNr--;
          break;
      }
      this.questionNr++;
    }
  }

  dayClicked({date}: { date: Date }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !(isSameDay(this.viewDate, date) && this.activeDayIsOpen);
      this.viewDate = date;
      this.isAttendanceLoading = true;
      this.isAttendanceError = false;
      this.isTodayHoliday= this.dateInHoliday(date, this.holidayDays)[0];
      const val=this.dateInHoliday(date, this.holidayRequests);
      this.isTodayHolidayRequest=val[0];
      this.todayHoliday= val[1];
      this.userService.getCurrentUserAttendance(this.formatDate(this.viewDate)).subscribe(
        value => {
          this.isAttendanceLoading = false;
          this.todayAttendance = value;
        },
        () => {
          this.isAttendanceLoading = false;
          this.isAttendanceError = true;
        });
      this.isActivityLoading = true;
      this.userService.getLoggedUserActivities().subscribe(value => {
          this.userActivities = value;
          this.isActivityLoading = false;
        },
        () => {
          this.isActivityLoading = false;
          this.isActivityError = true;
        }
      );
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onAddAttendance(content) {
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then().catch(() => {
      this.resetAddAttendance();
    });
  }

  private resetAddAttendance() {
    this.activity = {};
    this.comment = "";
    this.checkIn = '09:00';
    // this.checkOut = '17:OO';
    this.questionNr = 0;
  }

  addAttendance(attendanceFrom: NgForm) {
    const attendance: Attendance = {
      activity: attendanceFrom.value.activity,
      user: {},
      checkIn: this.formatDateTime(this.viewDate, this.checkIn),
      checkOut: this.formatDateTime(this.viewDate, this.checkOut),
      comment: attendanceFrom.value.comment
    }
    this.resetAddAttendance();
    this.isAttendanceLoading = true;
    this.userService.addCurrentUserAttendance(attendance).subscribe(value => {
      this.todayAttendance = [...this.todayAttendance, value];
      this.isAttendanceLoading = false;
      this.snackBar.open("Attendance added successfully", "Ok", {duration: 2000});
    }, () => {
      this.snackBar.open("Some error occurred! Could not add attendance", "Ok", {duration: 2000})
      this.isAttendanceLoading = false;
    });
  }

  formatDateTime(date, time) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [[year, month, day].join('-'), [time, '00'].join(':')].join('T');
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  formatTime(date) {
    const time = date.split('T')[1];
    const h = time.split(":")[0];
    const m = time.split(":")[1];

    return [h, m].join(':');
  }

  onDeleteAttendance(attendance: Attendance, content) {
    this.selectedAttendance = attendance;
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then().catch(() => {
    });
  }

  onEditAttendance(attendance: Attendance, content) {
    this.selectedAttendance = attendance;
    this.selectedAttendance.activity = this.userActivities.find(value => value.id == this.selectedAttendance.activity?.id);
    this.selectedAttendanceCheckIn = this.formatTime(this.selectedAttendance.checkIn);
    this.selectedAttendanceCheckOut = this.formatTime(this.selectedAttendance.checkOut);
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then().catch(() => {
    });
  }

  deleteAttendance(id) {
    this.isAttendanceLoading = true;
    this.userService.deleteAttendance(id).subscribe(
      () => {
        this.isAttendanceLoading = false;
        this.todayAttendance = this.todayAttendance.filter(value => value.id != id);
        this.snackBar.open("Attendance deleted successfully", "Ok", {duration: 2000});
      },
      () => {
        this.snackBar.open("Some error occurred! Could not delete attendance!", "Ok", {duration: 2000})
        this.isAttendanceLoading = false;
      })
  }

  editAttendance(editAttendanceForm: NgForm) {
    const updateAttendance = JSON.parse(JSON.stringify(this.selectedAttendance));
    updateAttendance.checkIn = this.formatDateTime(this.viewDate, this.selectedAttendanceCheckIn);
    updateAttendance.checkOut = this.formatDateTime(this.viewDate, this.selectedAttendanceCheckOut);
    updateAttendance.comment = editAttendanceForm.value.comment;
    updateAttendance.activity = editAttendanceForm.value.activity;
    this.isAttendanceLoading = true;
    this.userService.updateAttendance(updateAttendance).subscribe(
      value => {
        this.selectedAttendance.activity = this.userActivities.find(value1 => value1.id = value.activity?.id);
        this.selectedAttendance.checkIn = value.checkIn;
        this.selectedAttendance.checkOut = value.checkOut;
        this.selectedAttendance.comment = value.comment;
        this.isAttendanceLoading = false;
        this.snackBar.open("Attendance updated successfully", "Ok", {duration: 2000});
      }, () => {
        this.isAttendanceLoading = false;
        this.snackBar.open("Some error occurred! Could not update attendance!", "Ok", {duration: 2000})
      })
  }


  showAttendanceInterval: any;

  showPopUpCurrentDayAttendance() {
    const emittedValue = {
      day: {
        badgeTotal: 0,
        date: new Date(),
        events: [],
        inMonth: true,
        isFuture: false,
        isPast: false,
        isToday: true,
        isWeekend: false,
      },
    };
    if (!this.calendar.activeDayIsOpen) {
      console.log(this.calendar)
      this.zone.run(() => {
        this.calendar.dayClicked.emit(emittedValue);
        this.cdr.detectChanges();

      })
      this.showAttendanceInterval = setInterval(() => {
        if (!this.isAttendanceError && !this.isAttendanceLoading) {
          let element = document.getElementById("add-attendance") as HTMLElement;
          element.click();
          clearInterval(this.showAttendanceInterval)
        }
        if (this.isAttendanceError)
          clearInterval(this.showAttendanceInterval)
      }, 1100,);
    } else {
      if (!this.isAttendanceError && !this.isAttendanceLoading) {
        let element = document.getElementById("add-attendance") as HTMLElement;
        element.click();
      }
    }

  }

  onRequestHoliday(content){
    this.modalService.open(content, {centered: true, size: 'sm'}).result.then().catch(() => {

    });
  }

  requestHoliday(requestForm:NgForm){
    console.log(requestForm.value)
    let holiday:Holiday={
      startDate: this.formatDate( requestForm.value.startDate),
      endDate: this.formatDate(requestForm.value.endDate)
    }
    this.holidayService.addHolidayRequest(holiday).subscribe(value => {
      console.log(value);
      this.snackBar.open("Request made successfully", "Ok", {duration: 2000})
      window.location.reload();
    }, () => {
      this.snackBar.open("Cannot request holiday in this interval!", "Ok", {duration: 2000})
    });
  }

  deleteHolidayRequest(holiday: Holiday) {
    if(holiday.id) {
      this.holidayService.deleteHolidayRequest(holiday.id).subscribe(() => {
        window.location.reload();
      }, () => {
        this.snackBar.open("Some error occurred!", "Ok", {duration: 2000})
      });
    }
    else{
      this.snackBar.open("There is an error, please refresh page!", "Ok", {duration: 2000});
    }
  }
}
