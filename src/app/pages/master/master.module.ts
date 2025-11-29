import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { MasterRoutingModule } from './master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { TranslatePipe } from 'src/app/translate/translate.pipe';





@NgModule({
  declarations: [
    CategoryComponent,
 

  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [
    TranslatePipe
  ]
})
export class MasterModule { }
