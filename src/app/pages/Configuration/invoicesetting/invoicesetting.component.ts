import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IInvoiceSetting } from 'src/app/interfaces/configuration/invoicesetting';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  Action_Type,
  GridFilter,
} from 'src/app/shared/controls/grid/common_model';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoicesetting',
  templateUrl: './invoicesetting.component.html',
  styleUrl: './invoicesetting.component.css',
})
export class InvoicesettingComponent {
  invoices: IInvoiceSetting[] = [];
  invoice: IInvoiceSetting;
  parentMenu: ICommonValue[];
  invoiceForm: FormGroup;
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
    // {
    //   class: 'btn-outline-danger',
    //   text: null,
    //   font: 'fal fa-trash-alt',
    //   type: 'delete',
    // },
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
      DisplayText: 'Voucher Name',
      ColumnName: 'voucherName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Start Index',
      ColumnName: 'startIndex',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'PreFix',
      ColumnName: 'preFix',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Suffix',
      ColumnName: 'suffix',
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
    this.categories = [];
  }

  ngOnInit(): void {
    this.CreateInvoiceSettingForm();
    this.GetInvoiceSettingData();
  }

  //Form Create
  CreateInvoiceSettingForm() {
    this.invoiceForm = this.fb.group({
      id: [0],
      voucherId: [null, Validators.required],
      startIndex: [null, Validators.required],
      preFix: [null, Validators.required],
      suffix: [null, Validators.required],
    });
  }

  async GetInvoiceSettingData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'InvoicesettingApi/GetAllInvoiceSetting'
    );
    if (res.data) {
      this.invoices = res.data;
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
          'InvoicesettingApi/DeleteInvoiceSetting',
          params
        );
        if (res && res) {
          this.invoices = this.invoices.filter(
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
    this.invoice = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.invoice.id);
    } else {
      this.buttonText = 'Update';
      this.invoiceForm.patchValue(this.invoice);
      this.parentId = this.invoice.voucherId;
    }
  }

  async onSubmit() {
    if (this.invoiceForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const ProductData: IInvoiceSetting = this.invoiceForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'InvoicesettingApi/AddNewInvoiceSetting',
        ProductData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetInvoiceSettingData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.invoiceForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const taxData: IInvoiceSetting = this.invoiceForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'InvoicesettingApi/UpdateInvoiceSetting',
      taxData
    );

    if (res.isSuccess) {
      this.toastr.success('Category updated successfully');
      await this.GetInvoiceSettingData();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  cancel() {
    this.CreateInvoiceSettingForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }
}
