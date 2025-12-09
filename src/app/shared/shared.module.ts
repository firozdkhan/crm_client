import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownMenuComponent } from './_partial-forms/dropdown-menu/dropdown-menu.component';
import { DropdownNotificationComponent } from './_partial-forms/dropdown-notification/dropdown-notification.component';
import { LeftPanelComponent } from './_partial-forms/left-panel/left-panel.component';
import { LeftSideBarComponent } from './_partial-forms/leftSideBar/leftSideBar.component';
import { LogoComponent } from './_partial-forms/logo/logo.component';
import { NavFilterComponent } from './_partial-forms/nav-filter/nav-filter.component';
import { NavInfoCardComponent } from './_partial-forms/nav-info-card/nav-info-card.component';
import { PageBreadcrumbComponent } from './_partial-forms/page-breadcrumb/page-breadcrumb.component';

import { PageHeaderComponent } from './_partial-forms/page-header/page-header.component';
import { PageSettingsComponent } from './_partial-forms/page-settings/page-settings.component';
import { ShortCutMenuComponent } from './_partial-forms/short-cut-menu/short-cut-menu.component';
import { ShortCutModelComponent } from './_partial-forms/short-cut-model/short-cut-model.component';
import { SidebarMenuComponent } from './_partial-forms/sidebar-menu/sidebar-menu.component';
import { TabSettingsComponent } from './_partial-forms/tab-settings/tab-settings.component';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../translate/translate.pipe';
import { TotalStudentComponent } from './charts/total-student/total-student.component';
import { EmployeeAttendanceComponent } from './charts/employee-attendance/employee-attendance.component';
import { StudentAttendanceChartComponent } from './charts/student-attendance-chart/student-attendance-chart.component';
import { FinanceChartComponent } from './charts/finance-chart/finance-chart.component';

import { CustomSwitchComponent } from './controls/custom-switch/custom-switch.component';
import { DatePickerComponent } from './controls/date-picker/date-picker.component';
import { DateRangepickerComponent } from './controls/date-rangepicker/date-rangepicker.component';
import { EntryPanelHeaderComponent } from './controls/entry-panel-header/entry-panel-header.component';

import { FooterButtonsComponent } from './controls/footer-buttons/footer-buttons.component';
import { GenderDropdownComponent } from './controls/gender-dropdown/gender-dropdown.component';

import { NoDataFoundComponent } from './controls/no-data-found/no-data-found.component';
import { SelectDropdownComponent } from './controls/select-dropdown/select-dropdown.component';
import { ShowButtonComponent } from './controls/show-button/show-button.component';
import { ChangeDatePipe } from '../pipes/change-date.pipe';
import { TextAreaComponent } from './controls/text-area/text-area.component';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GridComponent } from './controls/grid/grid.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CityDropdownComponent } from './controls/city-dropdown/city-dropdown.component';
import { StateDropdownComponent } from './controls/state-dropdown/state-dropdown.component';
import { CountryDropdownComponent } from './controls/country-dropdown/country-dropdown.component';
import { CategoryDropdownComponent } from './controls/category-dropdown/category-dropdown.component';
import { PageFooterComponent } from './_partial-forms/page-footer/page-footer.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ImageUploadComponent } from './controls/image-upload/image-upload.component';
import { FileUploadModule } from 'ng2-file-upload';

import { SmartMenuDirective } from './directive/smart-menu.directive';
import { FileUploadComponent } from './controls/file-upload/file-upload.component';
import { MarkAsteriskDirective } from '../directive/mark-asterisk.directive';
import { OnlyNumber } from '../directive/only-number.directive';
import { FocusOnShowDirective } from '../directive/app-prefix-focus-and-select.directive';
import { FeesReceiptComponent } from './controls/fees-receipt/fees-receipt.component';
import { OnlyDateComponent } from './controls/only-date/only-date.component';
import { StaffPartialComponent } from './_partial-forms/staff-partial/staff-partial.component';
import { EmployeeDropdownComponent } from './controls/employee-dropdown/employee-dropdown.component';
import { EmpDocumentComponent } from './_partial-forms/emp-document/emp-document.component';
import { BaseChartDirective } from 'ng2-charts';
import { TStudentComponent } from './charts/t-student/t-student.component';
import { FeeReceiptComponent } from './_partial-forms/fee-receipt/fee-receipt.component';
import { SystemService } from './controls/grid/SystemService';

import { TreeNgxModule } from 'tree-ngx';

import { TreeViewMenuComponent } from './controls/tree-view/tree-view-menu.component';
import { StudentDocumentsComponent } from './_partial-forms/student-documents/student-documents.component';
import { AddNewStateComponent } from './controls/add-new-state/add-new-state.component';
import { AddNewCityComponent } from './controls/add-new-city/add-new-city.component';
import { PasswordInputComponent } from './controls/password-input/password-input.component';
import { TextInputComponent } from './controls/text-input/text-input.component';
import { LabelsComponent } from './controls/labels/labels.component';

import { NgxPrintModule } from 'ngx-print';
import { AmountInWordsPipe } from '../pipes/amount-in-words.pipe';
import { UserDropdownComponent } from './controls/user-dropdown/user-dropdown.component';
import { DateInputComponent } from './controls/date-input/date-input.component';

@NgModule({
  declarations: [
    LeftSideBarComponent,
    LeftPanelComponent,
    LogoComponent,
    NavFilterComponent,
    NavInfoCardComponent,
    ShortCutMenuComponent,
    PageSettingsComponent,
    TabSettingsComponent,
    DropdownNotificationComponent,
    DropdownMenuComponent,
    PageHeaderComponent,
    PageBreadcrumbComponent,
    ShortCutModelComponent,
    PageFooterComponent,
    SidebarMenuComponent,
    MarkAsteriskDirective,
    FocusOnShowDirective,
    TextInputComponent,
    SelectDropdownComponent,
    DatePickerComponent,
    CustomSwitchComponent,
    FooterButtonsComponent,
    TextAreaComponent,
    GenderDropdownComponent,
    GridComponent,
    CityDropdownComponent,
    StateDropdownComponent,
    CountryDropdownComponent,
    CategoryDropdownComponent,
    EmployeeDropdownComponent,
    EmpDocumentComponent,

    DateRangepickerComponent,
    NoDataFoundComponent,
    EntryPanelHeaderComponent,
    ShowButtonComponent,
    MarkAsteriskDirective,
    TranslatePipe,
    ImageUploadComponent,

    OnlyNumber,
    SmartMenuDirective,
    FileUploadComponent,
    ChangeDatePipe,
    OnlyDateComponent,
    FeesReceiptComponent,
    OnlyDateComponent,
    StaffPartialComponent,
    TotalStudentComponent,
    EmployeeAttendanceComponent,
    StudentAttendanceChartComponent,
    FinanceChartComponent,
    TStudentComponent,
    FeeReceiptComponent,
    TreeViewMenuComponent,
    StudentDocumentsComponent,
    AddNewStateComponent,
    AddNewCityComponent,
    PasswordInputComponent,
    LabelsComponent,

    AmountInWordsPipe,
      UserDropdownComponent,
      DateInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    BaseChartDirective,
    NgxPrintModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    FileUploadModule,
    TreeNgxModule,
  ],
  exports: [
    LeftSideBarComponent,
    LeftPanelComponent,
    LogoComponent,
    NavFilterComponent,
    NavInfoCardComponent,
    ShortCutMenuComponent,
    PageSettingsComponent,
    TabSettingsComponent,
    DropdownNotificationComponent,
    DropdownMenuComponent,
    PageHeaderComponent,
    PageBreadcrumbComponent,
    ShortCutModelComponent,
    PageFooterComponent,
    SidebarMenuComponent,
    TextInputComponent,

    FocusOnShowDirective,
    TextInputComponent,
    SelectDropdownComponent,
    DatePickerComponent,
    CustomSwitchComponent,
    FooterButtonsComponent,
    TextAreaComponent,
    GenderDropdownComponent,
    CityDropdownComponent,
    StateDropdownComponent,
    CountryDropdownComponent,
    CategoryDropdownComponent,
    EmployeeDropdownComponent,
    EmpDocumentComponent,

    BaseChartDirective,
    DateRangepickerComponent,
    NoDataFoundComponent,
    TranslatePipe,
    EntryPanelHeaderComponent,
    ShowButtonComponent,
    GridComponent,
    FileUploadComponent,
    MarkAsteriskDirective,
    ImageUploadComponent,

    OnlyNumber,
    ChangeDatePipe,
    FeesReceiptComponent,
    OnlyDateComponent,
    StaffPartialComponent,
    TotalStudentComponent,
    EmployeeAttendanceComponent,
    StudentAttendanceChartComponent,
    FinanceChartComponent,
    FeeReceiptComponent,
    TreeViewMenuComponent,
    StudentDocumentsComponent,
    AddNewStateComponent,
    AddNewCityComponent,
    PasswordInputComponent,
    LabelsComponent,
     UserDropdownComponent,
     DateInputComponent,
  ],
  providers: [
    BsDatepickerConfig,
    BsModalService,
    SmartMenuDirective,
    SystemService,
    TranslatePipe,
  ],
})
export class SharedModule {}
