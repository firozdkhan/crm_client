import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { SupplierComponent } from './supplier/supplier.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AddpurchaseComponent } from './addpurchase/addpurchase.component';
import { PrintpurchaseinvoiceComponent } from './printpurchaseinvoice/printpurchaseinvoice.component';
import { PurchaseinvoiceviewComponent } from './purchaseinvoiceview/purchaseinvoiceview.component';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { PurchasepaymentdueComponent } from './purchasepaymentdue/purchasepaymentdue.component';

@NgModule({
  declarations: [
    SupplierComponent,
    AddpurchaseComponent,
    PrintpurchaseinvoiceComponent,
    PurchaseinvoiceviewComponent,
    PurchasepaymentdueComponent,
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [TranslatePipe],
})
export class PurchaseModule {}
