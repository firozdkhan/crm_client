import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemstockComponent } from './itemstock/itemstock.component';
import { PeritemstockComponent } from './peritemstock/peritemstock.component';
import { FormsModule } from '@angular/forms';
import { PrintperitemstockComponent } from './printperitemstock/printperitemstock.component';
import { SaleperitemstockComponent } from './saleperitemstock/saleperitemstock.component';
import { StockpostingComponent } from './stockposting/stockposting.component';
import { SalegstreportComponent } from './salegstreport/salegstreport.component';
import { PurchasegstreportComponent } from './purchasegstreport/purchasegstreport.component';
import { ExpensesreportComponent } from './expensesreport/expensesreport.component';
import { ExpensesreportprintComponent } from './expensesreportprint/expensesreportprint.component';



@NgModule({
  declarations: [ItemstockComponent, PeritemstockComponent, PrintperitemstockComponent, SaleperitemstockComponent, StockpostingComponent, SalegstreportComponent, PurchasegstreportComponent, ExpensesreportComponent, ExpensesreportprintComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
  ],
})
export class ReportModule {}
