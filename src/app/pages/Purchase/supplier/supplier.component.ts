import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { ISupplier } from 'src/app/interfaces/Purchase/supplier';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent {
  suppliers: ISupplier[] = [];
  supplier: ISupplier;
  parentMenu: ICommonValue[];
  supplierForm: FormGroup;
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
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
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
      DisplayText: 'Supplier Name',
      ColumnName: 'suppliersName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Code',
      ColumnName: 'code',
      Type: 'number',
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
    this.CreateSupplierForm();
    this.GetSupplierData();
    // this.GetCountryData();
  }

  //Form Create
  CreateSupplierForm() {
    this.supplierForm = this.fb.group({
      id: [0],
      // supplierId: [null, Validators.required],
      suppliersName: [null],
      code: [null],
      address: [null],
      gstNumber: [null],
      phoneNumber: [null],
      countryId: [null],
      cityId: [null],
      stateId: [null, Validators.required],
      email: [null],
      creditPeriod: [null],
      creditLimit: [null],
      openingBalance: [null],
    });
  }

  //GetData
  async GetSupplierData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'SupplierApi/GetAllSupplier'
    );
    if (res.data) {
      this.suppliers = res.data;
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
          'SupplierApi/DeleteSupplier',
          params
        );
        if (res && res) {
          this.suppliers = this.suppliers.filter(
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
    this.supplier = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.supplier.id);
    } else {
      this.buttonText = 'Update';
      this.supplierForm.patchValue(this.supplier);
      this.parentId = this.supplier.id;
    }
  }

  async onSubmit() {
     
    if (this.supplierForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const SupplierData: ISupplier = this.supplierForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'SupplierApi/AddNewSupplier',
        SupplierData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetSupplierData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.supplierForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const SupplierData: ISupplier = this.supplierForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'SupplierApi/UpdateSupplier',
      SupplierData
    );

    if (res.isSuccess) {
      this.toastr.success('Category updated successfully');
      await this.GetSupplierData();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  cancel() {
    this.CreateSupplierForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }
}
