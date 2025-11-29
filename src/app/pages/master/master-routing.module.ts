import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
 



const routes: Routes = [
  { path: '', component: CategoryComponent },
  { path: 'category', component: CategoryComponent, data: { breadcrumb: 'Add New Master', icon: "fal fa-school" } },
  

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MasterRoutingModule { }
