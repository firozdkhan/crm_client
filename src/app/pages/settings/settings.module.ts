import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LanguageComponent } from './language/language.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { QrAndLinksComponent } from './qr-and-links/qr-and-links.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PraivacyPolicyComponent } from './praivacy-policy/praivacy-policy.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { StateComponent } from './state/state.component';
import { CityComponent } from './city/city.component';
import { SkuComponent } from './sku/sku.component';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { HelpPageComponent } from './help-page/help-page.component';
import { HelpReportComponent } from './help-report/help-report.component';
import { SchoolProfileComponent } from './school-profile/school-profile.component';
import { AppversionComponent } from './appversion/appversion.component';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    AddMenuComponent,
    LanguageComponent,
    SchoolProfileComponent,
    ChangePasswordComponent,
    UserComponent,
    RoleComponent,
    ResetPasswordComponent,
    QrAndLinksComponent,
    PraivacyPolicyComponent,
    CreateUserComponent,
    TermsAndConditionComponent,
    StateComponent,
    CityComponent,
    SkuComponent,
    HelpPageComponent,
    HelpReportComponent,
    AppversionComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    QRCodeModule,
  ],
  providers: [TranslatePipe],
})
export class SettingsModule {}
