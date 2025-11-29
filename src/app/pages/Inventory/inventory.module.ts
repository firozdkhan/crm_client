import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { UnitmesuementComponent } from './unitmesuement/unitmesuement.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProductComponent } from './product/product.component';

@NgModule({
  declarations: [UnitmesuementComponent, ProductComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class InventoryModule {}
