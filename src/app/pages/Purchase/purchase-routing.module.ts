import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierComponent } from './supplier/supplier.component';
import { AddpurchaseComponent } from './addpurchase/addpurchase.component';
import { PrintpurchaseinvoiceComponent } from './printpurchaseinvoice/printpurchaseinvoice.component';
import { PurchaseinvoiceviewComponent } from './purchaseinvoiceview/purchaseinvoiceview.component';
import { PurchasepaymentdueComponent } from './purchasepaymentdue/purchasepaymentdue.component';

const routes: Routes = [
  { path: 'supplier', component: SupplierComponent },
  { path: 'addpurchase', component: AddpurchaseComponent },
  { path: 'printpurchaseinvoice', component: PrintpurchaseinvoiceComponent },
  { path: 'purchaseinvoiceview', component: PurchaseinvoiceviewComponent },
  { path: 'purchasepaymentdue', component: PurchasepaymentdueComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {}
