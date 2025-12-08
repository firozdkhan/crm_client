import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataDirectoryComponent } from './data-directory/data-directory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
 
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { MisRoutingModule } from './mis-routing.module';
import { PincodeComponent } from './pincode/pincode.component';
import { VisitFormComponent } from './visit-form/visit-form.component';



@NgModule({
  declarations: [
    DataDirectoryComponent, PincodeComponent, VisitFormComponent
  ],
  imports: [
    CommonModule,
        MisRoutingModule,
        SharedModule,
        FormsModule, ReactiveFormsModule,
  ],
    providers: [
      TranslatePipe
    ]
})
export class MisModule { }
