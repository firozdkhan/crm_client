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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
