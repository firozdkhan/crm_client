import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { LanguageComponent } from './language/language.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { QrAndLinksComponent } from './qr-and-links/qr-and-links.component';
import { PraivacyPolicyComponent } from './praivacy-policy/praivacy-policy.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { StateComponent } from './state/state.component';
import { CityComponent } from './city/city.component';
import { SkuComponent } from './sku/sku.component';

import { HelpPageComponent } from './help-page/help-page.component';
import { HelpReportComponent } from './help-report/help-report.component';
import { SchoolProfileComponent } from './school-profile/school-profile.component';

const routes: Routes = [
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'add-menu',
    canActivate: [AuthGuard],
    component: AddMenuComponent,
    data: { breadcrumb: 'Add New Menu', icon: 'fal fa-school' },
  },
  {
    path: 'language',
    canActivate: [AuthGuard],
    component: LanguageComponent,
    data: { breadcrumb: 'Language Fields', icon: 'fal fa-school' },
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { breadcrumb: 'Change Password', icon: 'fal fa-school' },
  },

  {
    path: 'user',
    canActivate: [AuthGuard],
    component: UserComponent,
    data: { breadcrumb: 'Users List', icon: 'fal fa-school' },
  },
  {
    path: 'role',
    canActivate: [AuthGuard],
    component: RoleComponent,
    data: { breadcrumb: 'Users Roles', icon: 'fal fa-school' },
  },
  {
    path: 'qr-and-links',
    component: QrAndLinksComponent,
    data: { breadcrumb: 'QR Codes & Links' },
  },
  { path: 'praivacy-policy', component: PraivacyPolicyComponent },
  {
    path: 'create-user',
    component: CreateUserComponent,
    data: { breadcrumb: 'Create New Users', icon: 'fal fa-school' },
  },
  { path: 'terms-and-condition', component: TermsAndConditionComponent },
  {
    path: 'state',
    component: StateComponent,
    data: { breadcrumb: 'Add New State', icon: 'fal fa-school' },
  },
  {
    path: 'city',
    component: CityComponent,
    data: { breadcrumb: 'Add New City', icon: 'fal fa-school' },
  },
  {
    path: 'sku',
    component: SkuComponent,
    data: { breadcrumb: 'Add Sku Data', icon: 'fal fa-school' },
  },

  {
    path: 'help-page',
    component: HelpPageComponent,
    data: { breadcrumb: 'Help Query', icon: 'fal fa-school' },
  },
  {
    path: 'help-report',
    component: HelpReportComponent,
    data: { breadcrumb: 'Help Report', icon: 'fal fa-school' },
  },
  { path: 'school-profile', component: SchoolProfileComponent, data: { breadcrumb: 'School Profile', icon: "fal fa-school" } },

];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
