import { Component, Input, OnInit } from '@angular/core';
import { IPaidFees } from 'src/app/interfaces/fees/paid';


@Component({
  selector: 'app-fees-receipt',
  templateUrl: './fees-receipt.component.html',
  styleUrls: ['./fees-receipt.component.scss']
})
export class FeesReceiptComponent implements OnInit {

  @Input() receiptDetails: IPaidFees;
  constructor() { }

  ngOnInit(): void {
  }



}
