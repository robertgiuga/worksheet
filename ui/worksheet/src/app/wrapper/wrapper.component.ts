import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDrawerMode} from "@angular/material/sidenav";

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {

  @ViewChild("sidenav",{ static: false }) sidenav;
  sidenavMode:MatDrawerMode="side";
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (event.target.innerWidth < 800) {
      this.sidenav.close();
      this.sidenavMode="over";
    }
    if (event.target.innerWidth > 800) {
      this.sidenav.open();
      this.sidenavMode="side";
    }
  }

}
