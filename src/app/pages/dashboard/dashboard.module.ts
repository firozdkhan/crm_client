import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRountingModule } from './dashboard-rounting.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './components/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from 'src/app/translate/translate.service';
import { TranslatePipe } from 'src/app/translate/translate.pipe';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,

    ReactiveFormsModule,
    DashboardRountingModule,
  ],
  providers: [
    TranslatePipe
  ],
})
export class DashboardModule { }
