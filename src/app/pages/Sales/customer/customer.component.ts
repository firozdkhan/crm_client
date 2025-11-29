import { CreateUserComponent } from './../../settings/create-user/create-user.component';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { ICustomer } from 'src/app/interfaces/sales/Customer';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  customers: ICustomer[] = [];
  customer: ICustomer;
  parentMenu: ICommonValue[];
  CustomerForm: FormGroup;
  parentId: number;
  buttonText: string = 'Submit';
  action: string = 'new';
  today = new Date();
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
  categories: any[];

  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Customer Name',
      ColumnName: 'customerName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Person',
      ColumnName: 'name',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Address',
      ColumnName: 'address',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'GST No',
      ColumnName: 'gstNumber',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Phone Number',
      ColumnName: 'phoneNumber',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Country',
      ColumnName: 'countryName',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'City',
      ColumnName: 'cityName',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'State',
      ColumnName: 'stateName',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Email',
      ColumnName: 'email',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Credit Period',
      ColumnName: 'creditPeriod',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Credit Limit',
      ColumnName: 'creditLimit',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Opening Balance',
      ColumnName: 'openingBalance',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Edit',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });

    this.categories = [];
  }

  ngOnInit(): void {
    this.CreateCustomerForm();
    this.GetCustomerData();
    this.GetCustomerDroupdown();
    // this.GetCountryData();
  }

  //Form Create
  CreateCustomerForm() {
    this.CustomerForm = this.fb.group({
      id: [0],
      customerName: [null, Validators.required],
      name: [null],
      address: [null],
      gstNumber: [null],
      phoneNumber: [null],       
      cityId: ["1089"],
      stateId: ["59", Validators.required],
      email: [null],
      creditPeriod: [null],
      creditLimit: [null],
      openingBalance: [null],
    });
  }

  async GetCustomerData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'CustomerApi/GetAllCustomer'
    );
    if (res.data) {
      this.customers = res.data;
    }
  }

  async deleteMenu(miscId: number) {
     
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set('id', miscId.toString());
        let res = await this.genericSErvice.ExecuteAPI_Delete(
          'CustomerApi/DeleteCustomer',
          params
        );
        if (res && res) {
          this.customers = this.customers.filter(
            (category) => category.id !== miscId
          );
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your record has been deleted.'),
            'success'
          );
        } else {
          this.toastr.error('Failed to delete record');
        }
      }
    });
  }

  actionRow(RowItem: any) {
    this.customer = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.customer.id);
    } else {
      this.buttonText = 'Update';
      this.CustomerForm.patchValue(this.customer);
      this.parentId = this.customer.id;
    }
  }

  async onSubmit() {
     
    if (this.CustomerForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const SupplierData: ICustomer = this.CustomerForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'CustomerApi/AddNewCustomer',
        SupplierData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetCustomerData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.CustomerForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const SupplierData: ICustomer = this.CustomerForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'CustomerApi/UpdateCustomer',
      SupplierData
    );

    if (res.isSuccess) {
      this.toastr.success('Customer updated successfully');
      await this.GetCustomerData();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  cancel() {
    this.CreateCustomerForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }
  customerdata: any[];
  async GetCustomerDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'CustomerApi/GetCustomerDropdown'
    );
    if (res.isSuccess) {
      this.customerdata = res.data;
    }
  }
}
