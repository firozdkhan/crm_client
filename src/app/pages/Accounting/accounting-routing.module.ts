import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankComponent } from './bank/bank.component';
import { PaymentvoucherComponent } from './paymentvoucher/paymentvoucher.component';
import { ReceiptvoucherComponent } from './receiptvoucher/receiptvoucher.component';
import { PrintpaymentvoucherComponent } from './printpaymentvoucher/printpaymentvoucher.component';
import { PrintreceiptvoucherComponent } from './printreceiptvoucher/printreceiptvoucher.component';

const routes: Routes = [
  { path: 'bank', component: BankComponent },
  { path: 'paymentvoucher', component: PaymentvoucherComponent },
  { path: 'receiptvoucher', component: ReceiptvoucherComponent },
  { path: 'printpaymentvoucher', component: PrintpaymentvoucherComponent },
  { path: 'printreceiptvoucher', component: PrintreceiptvoucherComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule {}
