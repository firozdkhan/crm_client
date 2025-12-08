import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffReportComponent } from './staff-report/staff-report.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
// import { UpdateStaffComponent } from './update-staff/update-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { StaffBankComponent } from './staff-bank/staff-bank.component';
import { StaffAllownaceComponent } from './staff-allownace/staff-allownace.component';
import { StaffAttendaceComponent } from './staff-attendace/staff-attendace.component';
import { StaffCategoryComponent } from './staff-category/staff-category.component';
import { AllstaffAttendanceComponent } from './allstaff-attendance/allstaff-attendance.component';
import { AllstaffReportComponent } from './allstaff-report/allstaff-report.component';
import { StaffShfitComponent } from './staff-shfit/staff-shfit.component';
import { StaffDeductionComponent } from './staff-deduction/staff-deduction.component';
import { UploadAttendnaceComponent } from './upload-attendnace/upload-attendnace.component';
import { StaffAttendancetimeComponent } from './staff-attendancetime/staff-attendancetime.component';
import { TimewiseAttendanceComponent } from './timewise-attendance/timewise-attendance.component';
import { StaffSalaryComponent } from './staff-salary/staff-salary.component';
import { StaffsalaryreportComponent } from './staffsalaryreport/staffsalaryreport.component';
 
import { AutofillTestComponent } from './autofill-test/autofill-test.component';

const routes: Routes = [
  { path: 'add-staff', component: AddStaffComponent, data: { breadcrumb: ' Employee Registration', icon: "fal fa-school" } },
  { path: 'staff-report', component: StaffReportComponent, data: { breadcrumb: 'Report', icon: "fal fa-school" } },
  { path: 'leave-request', component: LeaveRequestComponent, data: { breadcrumb: 'leave Request ', icon: "fal fa-school" } },
  { path: 'leave-report', component: LeaveReportComponent, data: { breadcrumb: 'leave Report', icon: "fal fa-school" } },
  // { path: 'update-staff/:id', component: UpdateStaffComponent },
  { path: 'staff-list', component: StaffListComponent, data: { breadcrumb: 'Contact Details', icon: "fal fa-school" } },
  { path: 'staff-bank', component: StaffBankComponent, data: { breadcrumb: 'Bank Details', icon: "fal fa-school" } },
  { path: 'staff-allownace', component: StaffAllownaceComponent, data: { breadcrumb: ' Allowance List', icon: "fal fa-school" } },
  { path: 'staff-details/:id', component: StaffDetailsComponent },
  { path: 'staff-attendace', component: StaffAttendaceComponent, data: { breadcrumb: 'Attendance ', icon: "fal fa-school" } },
  { path: 'staff-category', component: StaffCategoryComponent, data: { breadcrumb: 'Category ', icon: "fal fa-school" } },
  { path: 'allstaff-attendance', component: AllstaffAttendanceComponent, data: { breadcrumb: ' Attendance ', icon: "fal fa-school" } },
  { path: 'allstaff-report', component: AllstaffReportComponent, data: { breadcrumb: ' Attendance Report ', icon: "fal fa-school" } },
  { path: 'staff-shfit', component: StaffShfitComponent, data: { breadcrumb: ' Shfits', icon: "fal fa-school" } },
  { path: 'staff-deduction', component: StaffDeductionComponent, data: { breadcrumb: ' Deduction List', icon: "fal fa-school" } },
  { path: 'upload-attendnace', component: UploadAttendnaceComponent, data: { breadcrumb: ' Upload Attendanace', icon: "fal fa-school" } },
  { path: 'staff-attendancetime', component: StaffAttendancetimeComponent, data: { breadcrumb: ' Attendance Time wise', icon: "fal fa-school" } },
  { path: 'timewise-attendance', component: TimewiseAttendanceComponent, data: { breadcrumb: ' Attendance Time wise Report', icon: "fal fa-school" } },
  { path: 'staff-salary', component: StaffSalaryComponent, data: { breadcrumb: '  Salary Report', icon: "fal fa-school" } },
  { path: 'staffsalaryreport', component: StaffsalaryreportComponent, data: { breadcrumb: ' Payed Salary List', icon: "fal fa-school" } },
 
  { path: 'autofill-test', component: AutofillTestComponent, data: { breadcrumb: 'Pincode', icon: "fal fa-school" } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
