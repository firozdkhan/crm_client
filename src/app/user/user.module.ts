import { SharedModule } from './../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
