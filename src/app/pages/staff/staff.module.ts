import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { StaffRoutingModule } from './staff-routing.module';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffReportComponent } from './staff-report/staff-report.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';

import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { Ng2SearchPipeModule } from '@ngx-maintenance/ng2-search-filter';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
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
import { PincodeComponent } from './pincode/pincode.component';
import { AutofillTestComponent } from './autofill-test/autofill-test.component';

@NgModule({
  declarations: [
    AddStaffComponent,
    StaffReportComponent,
    LeaveReportComponent,
    LeaveRequestComponent,
    // UpdateStaffComponent,
    StaffListComponent,
    StaffDetailsComponent,
    StaffBankComponent,
    StaffAllownaceComponent,
    StaffAttendaceComponent,
    StaffCategoryComponent,
    AllstaffAttendanceComponent,
    AllstaffReportComponent,
    StaffShfitComponent,
    StaffDeductionComponent,
    UploadAttendnaceComponent,
    StaffAttendancetimeComponent,
    TimewiseAttendanceComponent,
    StaffSalaryComponent,
    StaffsalaryreportComponent,
    PincodeComponent,
    AutofillTestComponent,

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
