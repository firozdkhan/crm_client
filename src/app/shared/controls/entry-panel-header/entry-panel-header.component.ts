import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-panel-header',
  templateUrl: './entry-panel-header.component.html',
  styleUrls: ['./entry-panel-header.component.scss']
})
export class EntryPanelHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  constructor() { }

  ngOnInit(): void {
  }

}
