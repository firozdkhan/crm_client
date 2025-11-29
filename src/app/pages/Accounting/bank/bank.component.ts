import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IBankDetails } from 'src/app/interfaces/accounting/bankdetails';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { IBankDetail } from 'src/app/interfaces/staf/staff';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.css',
})
export class BankComponent {
  banks: IBankDetails[] = [];
  bank: IBankDetails;
  parentMenu: ICommonValue[];
  bankdetailsForm: FormGroup;
  parentId: number;
  buttonText: string = 'Submit';
  action: string = 'new';
  today = new Date();
  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    {class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit',tooltip:'Edit'},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',tooltip: 'Delete'},
  ];
  categories: any[];

  constructor(private fb: FormBuilder,private systemService: SystemService,private genericSErvice: GenericService,private trans: TranslatePipe,
    private toastr: ToastrService
  ) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Pay Type',ColumnName: 'bankName',Type: 'string',Is_Visible: true,});

    this.gridFilter.push(<GridFilter>{DisplayText: 'Account Type',ColumnName: 'accountType',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Account Number',ColumnName: 'accountNumber',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Country Name',ColumnName: 'countryName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'City',ColumnName: 'cityName',Type: 'string',Is_Visible: true,});

    this.gridFilter.push(<GridFilter>{DisplayText: 'State',ColumnName: 'stateName',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Opening Balance',ColumnName: 'openingBalance',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Edit',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});
    this.categories = [];
  }

  ngOnInit(): void {
    this.CreateBankDetailForm();
    this.GetBankData();
    this.GetBankDroupdown();
  }

  //Form Create
  CreateBankDetailForm() {
    this.bankdetailsForm = this.fb.group({
      id: [0],
      bankName: [null ,[Validators.required]],
      accountTypeId: [null, Validators.required],
      accountNumber: [null],
      countryId: [null],
      cityId: [null],
      stateId: [null],
      openingBalance: [null ,[Validators.required]],
    });
  }

  //GetData
  async GetBankData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'BankDetailsApi/GetAllBankDetails'
    );
    if (res.data) {
      this.banks = res.data;
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
          'BankDetailsApi/DeleteBankDetails',
          params
        );
        if (res && res) {
          this.banks = this.banks.filter((category) => category.id !== miscId);
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
    this.bank = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.bank.id);
    } else {
      this.buttonText = 'Update';
      this.bankdetailsForm.patchValue(this.bank);
      this.parentId = this.bank.id;
    }
  }

  async onSubmit() {
     
    if (this.bankdetailsForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const BankData: IBankDetails = this.bankdetailsForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'BankDetailsApi/AddNewBankDetails',
        BankData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetBankData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.bankdetailsForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const bankData: IBankDetail = this.bankdetailsForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'BankDetailsApi/UpdateBankDetails',
      bankData
    );

    if (res.isSuccess) {
      this.toastr.success('Category updated successfully');
      await this.GetBankData();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  cancel() {
    this.CreateBankDetailForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  async GetBankDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'BankDetailsApi/GetBankDropdown'
    );
    if (res.IsSuccess) {
      this.banks = res.data;
    }
  }
}
