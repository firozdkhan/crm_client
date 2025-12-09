import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataDirectoryComponent } from './data-directory/data-directory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PincodeComponent } from './pincode/pincode.component';
import { VisitFormComponent } from './visit-form/visit-form.component';
import { ClientVisitComponent } from './client-visit/client-visit.component';
import { VisitReportsComponent } from './visit-reports/visit-reports.component';
 




const routes: Routes = [
  
  { path: 'data-directory', component: DataDirectoryComponent, data: { breadcrumb: 'Directory Database', icon: 'fal fa-school' }, },
   { path: 'pincode', component: PincodeComponent, data: { breadcrumb: 'Pincodewise Data', icon: 'fal fa-school' }, },
   { path: 'client-visit', component: ClientVisitComponent, data: { breadcrumb: 'Client Visits', icon: 'fal fa-school' }, },
   { path: 'visit-reports', component: VisitReportsComponent, data: { breadcrumb: 'Visit Reports', icon: 'fal fa-school' }, },
 
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,

    ReactiveFormsModule,
    
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class MisRoutingModule { }
