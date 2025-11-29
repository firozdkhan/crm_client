import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { SalemasterComponent } from './salemaster/salemaster.component';
import { PrintsaleinvoiceComponent } from './printsaleinvoice/printsaleinvoice.component';
import { SaleinvoiceviewComponent } from './saleinvoiceview/saleinvoiceview.component';
import { SalepaymentdueComponent } from './salepaymentdue/salepaymentdue.component';
import { CollectionReportComponent } from './collection-report/collection-report.component';

const routes: Routes = [
  { path: 'customer', component: CustomerComponent },
  { path: 'salemaster', component: SalemasterComponent },
  { path: 'printsaleinvoice', component: PrintsaleinvoiceComponent },
  { path: 'saleinvoiceview', component: SaleinvoiceviewComponent },
  { path: 'salepaymentdue', component: SalepaymentdueComponent },
   { path:'collectionReport', component: CollectionReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
