import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { StaffRoutingModule } from './staff-routing.module';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffReportComponent } from './staff-report/staff-report.component';
  
import { UpdateStaffComponent } from './update-staff/update-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { Ng2SearchPipeModule } from '@ngx-maintenance/ng2-search-filter';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@NgModule({
  declarations: [
    AddStaffComponent,
    StaffReportComponent,
     
   
    UpdateStaffComponent,
    StaffListComponent,
    StaffDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StaffRoutingModule,
    Ng2SearchPipeModule
  ],
  providers: [
    TranslatePipe
  ]
})
export class StaffModule { }
