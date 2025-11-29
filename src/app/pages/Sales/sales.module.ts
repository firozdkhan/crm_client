import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalemasterComponent } from './salemaster/salemaster.component';
import { CustomerComponent } from './customer/customer.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrintsaleinvoiceComponent } from './printsaleinvoice/printsaleinvoice.component';
import { SaleinvoiceviewComponent } from './saleinvoiceview/saleinvoiceview.component';
import { SalepaymentdueComponent } from './salepaymentdue/salepaymentdue.component';
import { CollectionReportComponent } from './collection-report/collection-report.component';

@NgModule({
  declarations: [
    SalemasterComponent,
    CustomerComponent,
    PrintsaleinvoiceComponent,
    SaleinvoiceviewComponent,
    SalepaymentdueComponent,
    CollectionReportComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class SalesModule {}
