import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout/layout.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './user/components/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },

  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (mod) => mod.DashboardModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'masters',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/master/master.module').then((mod) => mod.MasterModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'settings',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (mod) => mod.SettingsModule
      ),
  },

  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((mod) => mod.UserModule),
  },
  {
    path: 'staff',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/staff/staff.module').then((mod) => mod.StaffModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'configuration',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/Configuration/configuration.module').then(
        (mod) => mod.ConfigurationModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/Inventory/inventory.module').then(
        (mod) => mod.InventoryModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'accounting',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/Accounting/accounting.module').then(
        (mod) => mod.AccountingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'purchase',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/Purchase/purchase.module').then(
        (mod) => mod.PurchaseModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'report',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/Report/report.module').then((mod) => mod.ReportModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'sales',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/Sales/sales.module').then((mod) => mod.SalesModule),
    canActivate: [AuthGuard],
  },
    {
    path: 'pending',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/Pendingpayment/pendingpayment.module').then((mod) => mod.PendingpaymentModule),
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
