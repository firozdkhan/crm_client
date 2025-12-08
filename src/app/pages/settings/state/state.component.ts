import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IResponse } from 'src/app/interfaces/response';
import { IState } from 'src/app/interfaces/settings/state';

import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit, OnDestroy {
  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete' }
  ];

  categories: IState[] = [];
  category: IState;
  parentMenu: ICommonValue[];
  parentId: number;
  txtSearch = "";
  totalRecords: number;
  action: string = "new";
  buttonText: string = "Submit";
  categoryForm: FormGroup;
  miscData$: Observable<Array<IMisc>>;
  miscSubscription: Subscription;
  dropdownData: ICommonValue[];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private storedData: StoredDataService,
    private systemService: SystemService,
    private genericService: GenericService
  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: "Country Name", ColumnName: "countryName", Type: "string", Is_Visible: true });

    this.gridFilter.push(<GridFilter>{ DisplayText: "State Name", ColumnName: "name", Type: "string", Is_Visible: true });

    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
    this.categories = []
  }

  ngOnInit(): void {
    this.getCountry();
    this.bindData();
    this.createCategoryForm();
  }

  pageChanged(obj: any) { }

  async getCountry() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'CountryApi/GetCountries'
    );
    if (res.isSuccess) {
      this.dropdownData = res.data;
    }
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("CountryApi/GetAllStates");
    if (res.isSuccess) {
      this.categories = res.data;
    }
  }

  createCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      countryId: [null, Validators.required],
      name: [null, Validators.required],
    });
  }

  cancel(): void {
    this.createCategoryForm();
    this.action = "new";
    this.buttonText = "Submit";
  }

  onSubmit(): void {
    if (this.action === "edit") {
      this.editCategory();
    } else {
      this.saveCategory();
    }

    this.action = "new";
    this.buttonText = "Submit";
    this.loadMiscData();
  }

  async editCategory() {
    this.category = this.categoryForm.value;
    let res = await this.genericService.ExecuteAPI_Put<IResponse>("CountryApi/UpdateState", this.category);
    if (res.isSuccess) {
      this.bindData();
      this.toastrService.success('Success', 'State updated successfully');
      this.cancel();
    }
  }

  async saveCategory() {
    this.category = this.categoryForm.value;
    let res = await this.genericService.ExecuteAPI_Post<IResponse>("CountryApi/SaveState", this.category);
    if (res.isSuccess) {
      this.ngZone.run(() => {
        this.bindData();
        this.cancel();
        this.toastrService.success('Success', 'State saved successfully');
      });
    }
  }

  async deleteMenu(stateId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set("id", stateId.toString());
        let res = await this.genericService.ExecuteAPI_Delete("CountryApi/DeleteState", params);
        if (res) {
          this.categories = this.categories.filter(category => category.id !== stateId);
          Swal.fire('Deleted!', 'The record has been deleted.', 'success');
        }
      }
    });
  }

  actionRow(RowItem: any) {
    this.category = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteMenu(this.category.id);
    } else {
      this.buttonText = "Update";
      this.categoryForm.patchValue(this.category);
      this.parentId = this.category.countryId;
    }
  }

  public changed(e: any): void {
    let item1 = this.parentMenu.find(i => i.id === e);
    if (e != "") {
      this.systemService.App.searchFilter.emit(item1.name);
    }
  }

  loadMiscData() {
    this.storedData.loadMiscData();
  }

  ngOnDestroy() {
    if (this.miscSubscription) {
      this.miscSubscription.unsubscribe();
    }
  }
}
