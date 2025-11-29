import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
  @Input() labelText: string = "";
  @Input() labelValue: string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
