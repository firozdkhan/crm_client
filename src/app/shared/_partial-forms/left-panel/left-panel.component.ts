import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'aside[app-left-panel]',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
