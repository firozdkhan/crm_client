import { HttpParams } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { IMenuList } from 'src/app/interfaces/settings/menu-interface';
import { ISKUData } from 'src/app/interfaces/settings/skuData';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { IRoles } from 'src/app/user/interfaces/user';
import Swal from 'sweetalert2';
import { NodeItem } from 'tree-ngx';

@Component({
  selector: 'app-sku',
  templateUrl: './sku.component.html',
  styleUrl: './sku.component.css'
})
export class SkuComponent implements OnInit {



  constructor(

    private fb: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,

    private sharedService: SystemService,
    private genericService: GenericService,
    private modalService: NgbModal,
    private trans: TranslatePipe

  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: "SKU", ColumnName: "sku", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Product Description", ColumnName: "productDiscription", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Price", ColumnName: "price", Type: "number", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Dealer Price", ColumnName: "dealerPrice", Type: "number", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });

    this.skuDatas = []
  }


  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete' },
  ];


  skuDatas: ISKUData[] = [];
  skuData: ISKUData;
  parentMenu: ICommonValue[];
  parentId: number;
  miscCategory: ICategoryLabels = CategoryLabelData;
  txtSearch = "";
  totalRecords: number;
  action: string = "new";
  buttonText: string = "Submit";
  errors: string[];
  skdDataForm: FormGroup;
  roles: IRoles[] = [];
  role: IRoles;
  menuList: Array<IMenuList> = [];
  permissions: number[];
  public firstTree: NodeItem<string>[] = [];
  menuItems: NodeItem<string>[] = [];




  ngOnInit(): void {
    this.bindData();
    this.createSKUDataForm();
    this.getMenus();

  }


  async bindData() {

    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Core/GetSKUDataList");
    if (res.isSuccess) {
      this.skuDatas = res.data;
      this.totalRecords = res.length;
    }
  }

  createSKUDataForm() {
    this.skdDataForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      sku: [null, [Validators.required]],
      productDiscription: [null, [Validators.required]],
      price: [null, [Validators.required]],
      dealerPrice: [null, [Validators.required]],


    });
  }


  cancel(): void {
    this.buttonText = "Submit";
    this.action = "new";
    this.sharedService.App.searchFilter.emit("");
    this.createSKUDataForm();
  }

  onSubmit(): void {

    if (this.action === "edit") {
      this.editSKUData();
    }
    else {
      this.saveSKUData();
    }

    this.action = "new";
    this.buttonText = "Submit";
  }

  pageChanged(obj: any) { }

  async editSKUData() {

    this.skuData = this.skdDataForm.value;
    this.skuData.permissions = this.permissions;

    let res = await this.genericService.ExecuteAPI_Put<Array<IResponse>>("Core/UpdateSKUData", this.skuData);

    if (res) {
      this.skuDatas = res;
      this.toastrService.success('Success', 'SKU data updated successfully');
      this.bindData();
      this.cancel();


    }
  }

  async saveSKUData() {

    this.skuData = this.skdDataForm.value;
    this.skuData.permissions = this.permissions;
    let res = await this.genericService.ExecuteAPI_Post<Array<IResponse>>("Core/AddSKUData", this.skuData);

    if (res) {

      this.skuDatas = res;
      console.log(this.skuDatas);
      this.toastrService.success('Success', 'SKU data save successfully');
      this.bindData();
      this.cancel();

    }
  }

  deleteSKUData(skuGroup: ISKUData) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {

        let params = new HttpParams().set("id", skuGroup.id.toString())

        let res = this.genericService.ExecuteAPI_Delete("Core/DeleteSKUData", params);
        if (res) {

          const index: number = this.skuDatas.indexOf(skuGroup);
          if (index !== -1) {
            this.skuDatas.splice(index, 1);
          }


          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your data has been deleted.'),
            'success'
          );
          this.cancel();
          this.bindData();
        }
      }
    });

  }




  actionRow(RowItem: any) {

    this.skuData = RowItem.item;
    this.skuData.permissions = this.permissions;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteSKUData(this.skuData);
    }
    else {

      this.getMenus(this.skuData.id);
      this.buttonText = "Update";
      this.skdDataForm.patchValue(this.skuData);
    }
  }



  public changed(e: any): void {
    let item1 = this.parentMenu.find(i => i.id === e);
    if (e != "") {
      this.sharedService.App.searchFilter.emit(item1.name);
    }
  }

  open(content) {

    this.modalService.open(content);
  }

  onSelectedChange(event: any): void {

    let permissions: string[] = event.selectedPermissions as string[]
    let names = this.menuList.filter(s => permissions.includes(s.menuName));
    let parentMenuID: number[] = [...new Set(names.filter(x => x.parentMenuID != null).map(x => { return x.parentMenuID }))];
    let result: number[] = names.map(x => { return x.id })
    this.permissions = result;

  }

  async getMenus(skuId: any = 1) {

    let params = new HttpParams().set("skuId", skuId)
    let res = await this.genericService.ExecuteAPI_Get<IResponse>('Core/getSKUMenuTree', params);
    if (res.isSuccess) {

      this.menuItems = res.data;


    }

    let data = await this.genericService.ExecuteAPI_Get<IResponse>("Core/getMenuData", params);
    if (data) {
      this.menuList = data.menuList;

    }

  }



}
