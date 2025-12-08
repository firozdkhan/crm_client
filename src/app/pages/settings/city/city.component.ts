import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ICity } from 'src/app/interfaces/dashboard/city';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { ICities } from 'src/app/interfaces/locations/city';
import { IResponse } from 'src/app/interfaces/response';
import { IState } from 'src/app/interfaces/settings/state';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent implements OnInit, OnDestroy {
  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete' }
  ];
  state: IState[] = [];
  categories: ICities[] = [];
  category: ICities;
  parentMenu: ICommonValue[];
  parentId: String;
  txtSearch = "";
  totalRecords: number;
  action: string = "new";
  buttonText: string = "Submit";
  cityForm: FormGroup;
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

    this.gridFilter.push(<GridFilter>{ DisplayText: "State Name", ColumnName: "stateName", Type: "string", Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "City Name", ColumnName: "name", Type: "string", Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
    this.categories = []
  }

  ngOnInit(): void {

    this.bindData();
    this.citydata();
    this.createCategoryForm();
  }

  pageChanged(obj: any) { }


  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("CountryApi/GetAllStates");
    if (res.isSuccess) {
      this.state = res.data;
    }
  }

  async citydata() {
    let ress = await this.genericService.ExecuteAPI_Get<IResponse>("CountryApi/GetCities");
    if (
      ress.isSuccess
    ) {
      this.categories = ress.data;
      this.bindData;
    }
  }


  createCategoryForm() {
    this.cityForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      stateId: [null, Validators.required],
      name: [null, Validators.required],
    });
  }

  cancel(): void {
    this.createCategoryForm();
    this.buttonText = "Submit";
    this.action = "new";
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
    this.category = this.cityForm.value;
    let res = await this.genericService.ExecuteAPI_Put<IResponse>("CountryApi/UpdateCity", this.category);
    if (res.isSuccess) {
      this.bindData();
      this.ngOnInit();
      this.toastrService.success('Success', 'City updated successfully');
      this.cancel();
    }
  }

  async saveCategory() {
    this.category = this.cityForm.value;
    let res = await this.genericService.ExecuteAPI_Post<IResponse>("CountryApi/SaveCity", this.category);
    if (res.isSuccess) {
      this.ngZone.run(() => {
        this.bindData();
        this.ngOnInit();
        this.cancel();
        this.toastrService.success('Success', 'City saved successfully');
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
        let res = await this.genericService.ExecuteAPI_Delete("CountryApi/DeleteCity", params);
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
      this.cityForm.patchValue(this.category);
      this.parentId = this.category.stateId;
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
