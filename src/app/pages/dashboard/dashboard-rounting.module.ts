import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { AuthGuard } from 'src/app/services/auth.guard';


const routes: Routes = [
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
  { path: '', canActivate: [AuthGuard], component: DashboardComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
  , exports: [RouterModule]
})
export class DashboardRountingModule { }
