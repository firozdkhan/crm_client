import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/controls/grid/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  constructor(
    private http: HttpClient,private fb: FormBuilder,private toastrService: ToastrService,private ngZone: NgZone,private storedData: StoredDataService,
    private systemService: SystemService,private genericSErvice: GenericService,private trans: TranslatePipe) {

    this.gridFilter.push(<GridFilter>{ DisplayText: "Name", ColumnName: "name", Type: "string", Is_Visible: true });

    this.gridFilter.push(<GridFilter>{ DisplayText: "Parent Name", ColumnName: "parentName", Type: "string", Is_Visible: true });

    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
    this.categories = []
  }
  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit',tooltip :'Edit' },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete' , tooltip :'Delete' },
  ];


  categories: IMisc[] = [];
  category: IMisc;
  parentMenu: ICommonValue[];
  parentId: number;
  catvalue: string;
  txtSearch = "";
  totalRecords: number;
  action: string = "new";
  buttonText: string = "Submit";
  errors: string[];
  categoryForm: FormGroup;
  miscData$: Observable<Array<IMisc>>;
  miscSubscrition: Subscription;




  ngOnInit(): void {
    this.bindData();
    this.createCategoryForm();
    this.bindDropdowns();
  }



  async bindDropdowns() {
    let params = new HttpParams().set("miscId", null)
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>("MasterMisc/GetParentCategory");
    if (res) {
      this.parentMenu = res.data;
    }

  }
  pageChanged(obj: any) { }

  async bindData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>("MasterMisc/GetMiscCategory");
    if (res) {
      console.log(res.data);
      this.categories = res.data;
    }
  }

  createCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      parentId: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      name: ['', [Validators.required]]


    });
  }

  cancel(): void {
    this.createCategoryForm();
    this.action = "new";
    this.buttonText = "Submit";
  }



  onSubmit(): void {

    if (this.action === "edit") {
      this.editcategory();
    }
    else {
      this.savecategory();
    }

    this.action = "new";
    this.buttonText = "Submit";
    this.loadMiscData();
  }



  async editcategory() {
    this.category = this.categoryForm.value;

    let res = await this.genericSErvice.ExecuteAPI_Put<IResponse>("MasterMisc/UpdateMiscCategory", this.category);

    if (res) {
      this.bindData();
      this.toastrService.success('Success', 'Category update successfully');
      this.cancel();
      this.loadMiscData();
    }
  }

  async savecategory() {
    this.category = this.categoryForm.value;
    let res = await this.genericSErvice.ExecuteAPI_Post<IResponse>("MasterMisc/AddNewCategory", this.category);

    if (res) {
      this.ngZone.run(() => {
        this.toastrService.success('Success', 'Category save successfully');
        this.bindData();
        this.cancel();
        this.loadMiscData();
      });
    }
  }

  async deleteMenu(miscId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set("id", miscId.toString());
        let res = await this.genericSErvice.ExecuteAPI_Delete("MasterMisc/deleteCategory", params);
        if (res) {

          this.categories = this.categories.filter(category => category.id !== miscId);
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your imaginary file has been deleted.'),
            'success'
          );
        }
      }
    });
  }





  actionRow(RowItem: any) {
    this.category = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteMenu(this.category.id);
    }
    else {
      this.buttonText = "Update";
      this.categoryForm.patchValue(this.category);
      this.parentId = this.category.parentId;
    }
  }

  public changed(e: any): void {


    let item1 = this.parentMenu.find(i => i.id === e);
    console.log(item1);

    if (e != "") {
      this.systemService.App.searchFilter.emit(item1.name);
    }
  }
  loadMiscData() {
    this.storedData.loadMiscData();
  }

  ngOnDestroy() {

    if (this.miscSubscrition) {
      this.miscSubscrition.unsubscribe;
    }

  }


}
