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
import { DatewiseReportComponent } from './datewise-report/datewise-report.component';
 
import { AttedetailreportComponent } from './attedetailreport/attedetailreport.component';
import { AttendancestatusComponent } from './attendancestatus/attendancestatus.component';
import { AttendancesummeryComponent } from './attendancesummery/attendancesummery.component';
import { LocationfetchingComponent } from './locationfetching/locationfetching.component';
import { MonthwiseReportComponent } from './monthwise-report/monthwise-report.component';
import { PrnitPageComponent } from './prnit-page/prnit-page.component';
import { SalaryslipComponent } from './salaryslip/salaryslip.component';
import { StaffattendancereportComponent } from './staffattendancereport/staffattendancereport.component';



@NgModule({
  declarations: [
    ItemstockComponent, PeritemstockComponent, PrintperitemstockComponent, SaleperitemstockComponent, StockpostingComponent, SalegstreportComponent, 
    PurchasegstreportComponent, ExpensesreportComponent, ExpensesreportprintComponent,
      DatewiseReportComponent,
    MonthwiseReportComponent,
    PrnitPageComponent,
  
    AttendancestatusComponent,
    AttendancesummeryComponent,
    AttedetailreportComponent,
    StaffattendancereportComponent,
    SalaryslipComponent,
    LocationfetchingComponent,
   
  
  
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
  ],
})
export class ReportModule {}
