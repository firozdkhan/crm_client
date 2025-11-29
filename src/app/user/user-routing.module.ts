import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent, data: { breadcrumb: 'User' } },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent,
    data: { breadcrumb: 'Login' },
  },

  // { path: 'user-role', component: UserRoleComponent, data: { breadcrumb: 'User-role'}}
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
