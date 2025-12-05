import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemstockComponent } from './itemstock/itemstock.component';
import { PeritemstockComponent } from './peritemstock/peritemstock.component';
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


const routes: Routes = [
  { path: 'itemstock', component: ItemstockComponent },
  { path: 'peritemstock', component: PeritemstockComponent },
  { path: 'printperitemstock', component: PrintperitemstockComponent },
  { path: 'saleperitemstock', component: SaleperitemstockComponent },
  { path: 'stockposting', component: StockpostingComponent },
  { path: 'salegstreport', component: SalegstreportComponent },
  { path: 'purchasegstreport', component: PurchasegstreportComponent },
  { path: 'expensesreport', component: ExpensesreportComponent },
  { path: 'expensesreportprint/:id', component: ExpensesreportprintComponent },
    {
    path: 'datewise-report',
    component: DatewiseReportComponent,
    data: { breadcrumb: 'Datewise Reports', icon: 'fal fa-school' },
  },
  {
    path: 'monthwise-report',
    component: MonthwiseReportComponent,
    data: { breadcrumb: 'Monthwise Reports', icon: 'fal fa-school' },
  },
  {
    path: 'prnit-page/:id',
    component: PrnitPageComponent,
    data: { breadcrumb: 'Print Page Reports', icon: 'fal fa-school' },
  },
  {
    path: 'attendancestatus',
    component: AttendancestatusComponent,
    data: { breadcrumb: 'Attendance Status', icon: 'fal fa-school' },
  },
  {
    path: 'attendancesummery',
    component: AttendancesummeryComponent,
    data: { breadcrumb: 'Attendance Summery', icon: 'fal fa-school' },
  },
  {
    path: 'attedetailreport',
    component: AttedetailreportComponent,
    data: { breadcrumb: 'Attendance Detail Report', icon: 'fal fa-school' },
  },
  {
    path: 'staffattendancereport',
    component: StaffattendancereportComponent,
    data: { breadcrumb: 'Attendance Report', icon: 'fal fa-school' },
  },
  {
    path: 'salaryslip',
    component: SalaryslipComponent,
    data: { breadcrumb: 'Staff Salary', icon: 'fal fa-school' },
  },
  {
    path: 'locationfetching',
    component: LocationfetchingComponent,
    data: { breadcrumb: 'Staff Location', icon: 'fal fa-school' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
