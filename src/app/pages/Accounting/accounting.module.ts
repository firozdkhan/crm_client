import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { BankComponent } from './bank/bank.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentvoucherComponent } from './paymentvoucher/paymentvoucher.component';
import { ReceiptvoucherComponent } from './receiptvoucher/receiptvoucher.component';
import { PrintpaymentvoucherComponent } from './printpaymentvoucher/printpaymentvoucher.component';
import { PrintreceiptvoucherComponent } from './printreceiptvoucher/printreceiptvoucher.component';

@NgModule({
  declarations: [BankComponent, PaymentvoucherComponent, ReceiptvoucherComponent, PrintpaymentvoucherComponent, PrintreceiptvoucherComponent],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AccountingModule {}
