import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICurrency } from './../../../interfaces/configuration/currency';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { IResponse } from 'src/app/interfaces/response';
import Swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.css',
})
export class CurrencyComponent {
  currencys: ICurrency[] = [];
  currency: ICurrency;
  parentId: number;
  currencyForm: FormGroup;
  buttonText: string = 'Submit';
  action: string = 'new';

  categories: any[];

  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Currency Name',
      ColumnName: 'currencyName',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Currency Symbol',
      ColumnName: 'currencySymbol',
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
  ngOnInit(): void {
    this.createCurrencyForm();
    this.GetCurrencyData();
  }

  createCurrencyForm() {
    this.currencyForm = this.fb.group({
      id: [0],
      currencyId: [null, Validators.required],
      currencySymbol: ['', [Validators.required]],
    });
  }

  async GetCurrencyData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'CurrencyApi/GetAllCurrency'
    );
    if (res) {
      this.currencys = res.data;

      console.log(this.currencys);
    }
  }

  async onSubmit() {
    if (this.currencyForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const taxData: ICurrency = this.currencyForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'CurrencyApi/AddNewCurrency',
        taxData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetCurrencyData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.EditForm();
    }
  }

  async EditForm() {
    if (this.currencyForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const taxData: ICurrency = this.currencyForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'CurrencyApi/UpdateCurrency',
      taxData
    );

    if (res.isSuccess) {
      this.toastr.success('Category updated successfully');
      await this.GetCurrencyData();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  actionRow(RowItem: any) {
    this.currency = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.currency.id);
    } else {
      this.buttonText = 'Update';
      this.currencyForm.patchValue(this.currency);
      this.parentId = this.currency.currencyId;
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
          'CurrencyApi/DeleteCurrency',
          params
        );
        if (res && res) {
          this.currencys = this.currencys.filter(
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

  cancel(): void {
    this.createCurrencyForm();
    // this.currencyForm.reset();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  pageChanged(obj: any) {}
}
