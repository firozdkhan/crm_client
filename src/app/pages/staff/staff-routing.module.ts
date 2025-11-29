import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffReportComponent } from './staff-report/staff-report.component';
 
import { UpdateStaffComponent } from './update-staff/update-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';

const routes: Routes = [
  { path: 'add-staff', component: AddStaffComponent, data: { breadcrumb: 'Staff Registration', icon: "fal fa-school" } },
  { path: 'staff-report', component: StaffReportComponent, data: { breadcrumb: 'Staff Report', icon: "fal fa-school" } },
 
  { path: 'update-staff/:id', component: UpdateStaffComponent },
  { path: 'staff-list', component: StaffListComponent, data: { breadcrumb: 'Staff Directory', icon: "fal fa-school" } },
  { path: 'staff-details/:id', component: StaffDetailsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
