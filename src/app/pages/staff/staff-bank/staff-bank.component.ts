import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IIFSC } from 'src/app/interfaces/staf/ifsc-detail';
import { IStaffBank } from 'src/app/interfaces/staf/staff-bank';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-bank',
  templateUrl: './staff-bank.component.html',
  styleUrl: './staff-bank.component.css',
})
export class StaffBankComponent implements OnInit {
  CompanyMasterForm: FormGroup;
  CompanyMasterList: IStaffBank[] = [];
  Company: IStaffBank;
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];
  ifsc: IIFSC;
  code: string;

  actions: Action_Type[] = [
    {
      class: 'btn-outline-primary',
      text: null,
      tooltip: 'Edit',
      font: 'fal fa-edit',
      type: 'edit',
    },
    {
      class: 'btn-outline-danger',
      text: null,
      tooltip: 'Delete',
      font: 'fal fa-trash-alt',
      type: 'delete',
    },
  ];
  buttonText: string = 'Submit';

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private genericService: GenericService,
    private trans: TranslatePipe
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Staff Name',
      ColumnName: 'staff',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Account Number',
      ColumnName: 'accountNumber',
      Type: 'number',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'IFSC  Code',
      ColumnName: 'ifsCode',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Bank Name',
      ColumnName: 'bankName',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Action',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });
  }

  ngOnInit(): void {
    this.createCompanyMasterForm();
    this.bindCompanies();
  }

  createCompanyMasterForm() {
    this.CompanyMasterForm = this.fb.group({
      id: [0],
      staffId: ['', Validators.required],
      staff: [''],
      accountNumber: ['', Validators.required],
      ifsCode: ['', Validators.required],
      bankName: [''],
      branchName: [''],
      centre: [''],
      district: [''],
      state: [''],
      address: [''],
    });
  }

  async doThis() {
    this.Company = this.CompanyMasterForm.value;
    this.code = this.Company.ifsCode;
    let param = new HttpParams().set('ifsc', this.code);
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Staff/ifscCode/',
      param
    );
    if (res.isSuccess) {
      this.ifsc = res.data;
      this.CompanyMasterForm.patchValue({
        bankName: this.ifsc.bank,
        centre: this.ifsc.centre,
        district: this.ifsc.district,
        state: this.ifsc.state,
        address: this.ifsc.address,
        branchName: this.ifsc.branch,
      });
    } else {
      this.toastrService.error(res.message);
    }
  }

  async bindCompanies() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Staff/GetAllStaffBankDetails'
    );
    if (res.isSuccess) {
      this.CompanyMasterList = res.data;
    }
  }

  cancel() {
    this.createCompanyMasterForm();
    this.buttonText = 'Submit';
  }

  async onSubmit(form: FormGroup) {
    if (form.valid) {
      try {
        let res;
        if (this.buttonText === 'Submit') {
          res = await this.genericService.ExecuteAPI_Post<IResponse>(
            'Staff/AddStaffBankDetails',
            form.value
          );
          this.toastrService.success('Satff Details added successfully!');
        } else {
          debugger;
          res = await this.genericService.ExecuteAPI_Put<IResponse>(
            'Staff/UpdateStaffBankDetails',
            form.value
          );
          this.toastrService.success('Satff Details updated successfully!');
        }

        if (res.isSuccess) {
          this.bindCompanies();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      } catch (error) {}
    }
  }

  async deleteData(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        let res = await this.genericService.ExecuteAPI_Delete<IResponse>(
          `Staff/DeleteStaffBankDetails?id=${id}`
        );
        if (res.isSuccess) {
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your imaginary file has been deleted.'),
            'success'
          );
          this.bindCompanies();
        }
      } catch (error) {}
    }
  }

  actionRow(RowItem: any) {
    this.Company = RowItem.item;
    this.action = RowItem.action;
    if (this.action === 'delete') {
      this.deleteData(this.Company.id);
    }
    if (this.action === 'edit') {
      this.buttonText = 'Update';
      this.CompanyMasterForm.patchValue(this.Company);
    }
  }
  pageChanged(obj: any) {}
}
