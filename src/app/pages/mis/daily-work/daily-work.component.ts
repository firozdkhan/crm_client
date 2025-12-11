import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IProduct } from 'src/app/interfaces/inventory/product';
import { IDailyWork } from 'src/app/interfaces/mis/dailyWork';
import { IResponse } from 'src/app/interfaces/response';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { IJWTTokan } from 'src/app/shared/interfaces/jwt.tokan';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-daily-work',
  templateUrl: './daily-work.component.html',
  styleUrl: './daily-work.component.css'
})
export class DailyWorkComponent implements OnInit {

  saleForm!: FormGroup;

  action: string = "new";
  buttonText: string = 'Submit';

  products: IProduct[] = [];
  productData: ICommonValue[];
  
  customerdata: any[] = [];

  selectedUser = '1';
  userDisabled = false;


   dailyWorkList: IDailyWork[] = [];

  totalRecords: number = 0;
  txtSearch = '';
  today = new Date();
  changeDateformat: any;
  gridFilter: Array<GridFilter> = [];

  actions: Action_Type[] = [
    {
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
      tooltip: 'Edit'
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
      tooltip: 'Delete'
    },
  ];



  constructor(
    private fb: FormBuilder,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService,
    private datepipe: DatePipe
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'User Name',
      ColumnName: 'userName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Date',
      ColumnName: 'currentDate',
      Type: 'date',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Product',
      ColumnName: 'productName',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Customer',
      ColumnName: 'customerName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Description',
      ColumnName: 'description',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Edit',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });
    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('smart_token');
    if (token) {
      const decoded = jwtDecode<IJWTTokan>(token);
      this.selectedUser = decoded.nameid;
      if (decoded.nameid != "2") {
        this.userDisabled = true;
      }
    }
    this.createForm();
    this.getProductData();
    this.GetCustomerDroupdown();
    this.getAllDailyWork();
  }

  createForm() {
    this.saleForm = this.fb.group({
      id: [0],
      customerId: [null, Validators.required],
      purchaseDate: ['', Validators.required],
      userId: [this.selectedUser, Validators.required],
      purchaseInvoiceNumber: [''],
      billDescription: [''],
      productId: [null, Validators.required],
    });
  }

  async getProductData() {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>('ProductApi/GetAllProduct');
    if (res.isSuccess) {
      const newProductList = res.data;
      const existingIds = this.products.map((p) => p.id);
      for (let newP of newProductList) {
        if (!existingIds.includes(newP.id)) {
          this.products.push(newP);
        }
      }
      this.productData = this.products.map((p) => <ICommonValue>{ id: p.id.toString(), name: p.productsName });
    }
  }

  async GetCustomerDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>('CustomerApi/GetCustomerDropdown');
    if (res.isSuccess) {
      this.customerdata = res.data;
    }
  }

 async onsubmitForm() {
  if (this.saleForm.invalid) {
    this.toastr.error('Invalid form');
    return;
  }

  const form = this.saleForm.getRawValue();
  const changeDate = new ChangeDatePipe(this.datepipe);

  const payload = {
    id: form.id || 0,
    staffId: Number(form.userId),

    currentDate: this.datepipe.transform(
      form.purchaseDate,
      'yyyy-MM-dd'
    ),
    productId: Number(form.productId),
    customerId: Number(form.customerId),
    description: form.billDescription
  };

  if (this.action === 'new') {
    const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
      'WorkReport/AddDailyWork',
      payload
    );

    if (res.isSuccess) {
      this.toastr.success(res.message || 'Saved successfully');
      this.cancel();
      await this.getAllDailyWork();
    }
  }
  else if (this.action === 'edit') {
    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'WorkReport/UpdateDailyWork',
      payload
    );

    if (res.isSuccess) {
      this.toastr.success(res.message || 'Updated successfully');
      this.cancel();
      await this.getAllDailyWork();
    }
  }
}

  async editcategory() {

    const payload = this.saleForm.getRawValue();
    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>('WorkReport/UpdateDailyWork', payload);

    if (res.isSuccess) {
      this.toastr.success(res.message || 'Updated successfully');
      this.cancel();
      await this.getAllDailyWork();
    } else {
      this.toastr.error(res?.message || 'Failed to update');
    }
  }

  cancel() {
    this.createForm();
    this.action = 'new';
    this.buttonText = 'Submit';
 this.today = new Date();
    this.saleForm.patchValue({ userId: this.selectedUser });
  }

  async getAllDailyWork() {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>('WorkReport/GetAllDailyWork');
    if (res.isSuccess) {
      this.dailyWorkList = res.data;

    } else {
      this.toastr.error(res.message || 'Failed to load data');
    }
  }

 actionRow(RowItem: any) {
  const item = RowItem.item;
  const action = RowItem.action;

  if (action === 'edit') {
    this.action = 'edit';
    this.buttonText = 'Update';


    const formattedDate = this.datepipe.transform(
      item.currentDate,
      'dd MMM yyyy'
    );

    this.saleForm.patchValue({
      id: item.id ?? 0,
      customerId: item.customerId,
      purchaseDate: formattedDate,
      userId: item.staffId,
      billDescription: item.description,
      productId: String(item.productId)
    });

  }
  else if (action === 'delete') {
    this.deleteMenu(item.id);
  }
}


  async deleteMenu(id: number) {
    if (!id) return;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {

      let params = new HttpParams().set("id", id.toString());
      const res = await this.genericSErvice.ExecuteAPI_Delete('WorkReport/DeleteDailyWork', params);
      if (res) {

        this.dailyWorkList = this.dailyWorkList.filter(x => x.id !== id);
        Swal.fire(this.trans.transform('Deleted!'), this.trans.transform('Your Data has been deleted.'), 'success');
      } else {
        this.toastr.error('Failed to delete');
      }
    }
  }

   pageChanged(obj: any) { }
}
