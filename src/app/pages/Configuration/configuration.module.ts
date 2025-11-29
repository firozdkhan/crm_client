import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { TaxComponent } from './tax/tax.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyComponent } from './currency/currency.component';
import { InvoicesettingComponent } from './invoicesetting/invoicesetting.component';

@NgModule({
  declarations: [TaxComponent, CurrencyComponent, InvoicesettingComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ConfigurationModule {}
