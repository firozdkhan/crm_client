import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-button',
  templateUrl: './show-button.component.html',
  styleUrls: ['./show-button.component.scss']
})
export class ShowButtonComponent implements OnInit {
  @Input("buttonText") buttonText:string;
  @Input("isValid") isValid:boolean=true;
  constructor() { }

  ngOnInit(): void {
  }

}
