import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalepaymentdueComponent } from './salepaymentdue/salepaymentdue.component';


const routes: Routes = [



{path :'salepaymentdue' , component:SalepaymentdueComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingpaymentRoutingModule { }
