import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ClassFeeComponent } from './class-fee/class-fee.component';
import { CompanyComponent } from './company/company.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRountingModule } from '../dashboard/dashboard-rounting.module';
import { DepartmenComponent } from './departmen/departmen.component';
import { ShiftTimeComponent } from './shift-time/shift-time.component';
import { MasterAllownaceComponent } from './master-allownace/master-allownace.component';
import { MasterDeductionComponent } from './master-deduction/master-deduction.component';
import { HolidayComponent } from './holiday/holiday.component';
import { SessionmasterComponent } from './sessionmaster/sessionmaster.component';
import { LeavemasterComponent } from './leavemaster/leavemaster.component';

const routes: Routes = [
  { path: '', component: CategoryComponent },
  { path: 'category', component: CategoryComponent, data: { breadcrumb: 'Add New Master', icon: 'fal fa-school' }, },
  { path: 'class-fee', component: ClassFeeComponent, data: { breadcrumb: 'Add New Fees', icon: 'fal fa-school' }, },
  {path: 'company',component: CompanyComponent,data: { breadcrumb: 'Add Branches', icon: 'fal fa-school' },},
  {path: 'departmen',component: DepartmenComponent,data: { breadcrumb: 'Department Master', icon: 'fal fa-school' },},
  {path: 'shift-time',component: ShiftTimeComponent,data: { breadcrumb: 'Add Shift', icon: 'fal fa-school' },},
  {path: 'master-allownace',component: MasterAllownaceComponent,data: { breadcrumb: 'Add Allowance', icon: 'fal fa-school' },},
  {path: 'master-deduction',component: MasterDeductionComponent,data: { breadcrumb: 'Add Deduction', icon: 'fal fa-school' },},
  {path: 'holiday',component: HolidayComponent,data: { breadcrumb: 'Add Holiday' },},
  {path: 'sessionmaster',component: SessionmasterComponent,data: { breadcrumb: 'Add Session' },},
  {path: 'leavemaster',component: LeavemasterComponent,data: { breadcrumb: 'Add Leave' },},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,

    ReactiveFormsModule,
    DashboardRountingModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class MasterRoutingModule { }
