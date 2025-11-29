import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingpaymentRoutingModule } from './pendingpayment-routing.module';
import { SalepaymentdueComponent } from './salepaymentdue/salepaymentdue.component';

import { SharedModule } from "../../shared/shared.module";



@NgModule({
  declarations: [
    SalepaymentdueComponent,


  ],
  imports: [
    CommonModule,
    PendingpaymentRoutingModule,
    SharedModule
]
})
export class PendingpaymentModule { }
