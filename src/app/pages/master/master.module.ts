import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { MasterRoutingModule } from './master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassFeeComponent } from './class-fee/class-fee.component';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { CompanyComponent } from './company/company.component';
import { DepartmenComponent } from './departmen/departmen.component';
import { ShiftTimeComponent } from './shift-time/shift-time.component';
import { MasterAllownaceComponent } from './master-allownace/master-allownace.component';
import { MasterDeductionComponent } from './master-deduction/master-deduction.component';
import { HolidayComponent } from './holiday/holiday.component';
import { SessionmasterComponent } from './sessionmaster/sessionmaster.component';
import { LeavemasterComponent } from './leavemaster/leavemaster.component';






@NgModule({
  declarations: [
    CategoryComponent,
    ClassFeeComponent,
    CompanyComponent,
    DepartmenComponent,
    ShiftTimeComponent,
    MasterAllownaceComponent,
    MasterDeductionComponent,
    HolidayComponent,
    SessionmasterComponent,
    LeavemasterComponent



  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,

  ],
  providers: [
    TranslatePipe
  ]
})
export class MasterModule { }
