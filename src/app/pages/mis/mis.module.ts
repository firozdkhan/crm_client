import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataDirectoryComponent } from './data-directory/data-directory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
 
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { MisRoutingModule } from './mis-routing.module';
import { PincodeComponent } from './pincode/pincode.component';
import { VisitFormComponent } from './visit-form/visit-form.component';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ClientVisitComponent } from './client-visit/client-visit.component';
import { VisitReportsComponent } from './visit-reports/visit-reports.component';



@NgModule({
  declarations: [
    DataDirectoryComponent, PincodeComponent, VisitFormComponent, ClientVisitComponent, VisitReportsComponent
  ],
  imports: [
    CommonModule,
        MisRoutingModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
  ],
    providers: [
      TranslatePipe,
      BsDatepickerConfig,
          BsModalService,
    ]
})
export class MisModule { }
