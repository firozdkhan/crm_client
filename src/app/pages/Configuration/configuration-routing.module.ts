import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxComponent } from './tax/tax.component';
import { CurrencyComponent } from './currency/currency.component';
import { InvoicesettingComponent } from './invoicesetting/invoicesetting.component';

const routes: Routes = [
  { path: 'tax', component: TaxComponent },
  { path: 'currency', component: CurrencyComponent },
  { path: 'invoicesetting', component: InvoicesettingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
