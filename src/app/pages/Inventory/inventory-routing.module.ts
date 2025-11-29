import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitmesuementComponent } from './unitmesuement/unitmesuement.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: 'unitmesuement', component: UnitmesuementComponent },
  { path: 'product', component: ProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
