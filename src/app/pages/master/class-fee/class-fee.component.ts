import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IFees } from 'src/app/interfaces/fees';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/controls/grid/common_model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-class-fee',
  templateUrl: './class-fee.component.html',
  styleUrls: ['./class-fee.component.css']
})
export class ClassFeeComponent implements OnInit {
  constructor(private toastr: ToastrService, private generic: GenericService, private http: HttpClient,
    private fb: FormBuilder, private systemService: SystemService) {
    this.gridFilter.push(<GridFilter>{ DisplayText: "Class Name", ColumnName: "className", Type: "string", Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Fee Name", ColumnName: "feeName", Type: "string", Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Amount", ColumnName: "amount", Type: "string", Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
  }

  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-success', tooltip: "Apply for all students", text: null, font: 'fal fa-check', type: 'confirm' },
    { class: 'btn-outline-primary', tooltip: "Update", text: null, font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', tooltip: "Delete", text: null, font: 'fal fa-trash-alt', type: 'delete' },
  ];

  feeList: IFees[] = [];
  fee: IFees;
  feeForm: FormGroup;
  responseMessage: string;
  dropdownData: ICommonValue[];
  classDropdown: ICommonValue[];
  submitted = false;
  catvalue: string;
  buttonText: string = "Save";
  apiUrl = environment.apiUrl;
  headers_object: HttpHeaders;
  txtSearch = "";
  cat: IMisc[] = [];
  totalRecords: number;
  action: string = "new";
  sessionId = localStorage.getItem('smart_Sessionid');

  ngOnInit() {
    this.getFees();
    this.createForm();
  }

  pageChanged(obj: any) { }

  async getFees() {
    let res = await this.generic.ExecuteAPI_Get<IResponse>('Fees/GetAllClassFee');
    if (res.isSuccess) {
      this.feeList = res.data;
    }
  }

  createForm() {
    this.feeForm = this.fb.group({
      id: [0, Validators.required],
      classId: ['', [Validators.required]],
      feeNameId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      sessionId: [this.sessionId, [Validators.required]],
    });
  }

  cancel() {
    this.createForm();
    this.buttonText = "Save";
  }

  async onSubmit(feeForm: FormGroup) {

    this.fee = feeForm.value;
    if (this.buttonText === "Save") {
      let data = await this.generic.ExecuteAPI_Post<IResponse>('Fees/AddClassFee', this.fee);
      if (data.isSuccess) {
        this.toastr.success("Data has been saved");
      }

      else {
        this.toastr.error("Fee already exists");
      }
      this.getFees();
    }

    else {
      let data = await this.generic.ExecuteAPI_Put<IResponse>('Fees/UpdateClassFee', this.fee);
      if (data.isSuccess) {
        this.toastr.success("Data has been updated");
        this.cancel();
        this.getFees();
      } else {
        this.toastr.error("Fee already exists");
      }
    }
    this.createForm();
    this.buttonText = "Save";
  }

  async actionRow(RowItem: any) {
    this.fee = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteData(this.fee.id);
    } else if (this.action === "confirm") {
      this.applyForAllStudents(this.fee);
    } else {
      this.buttonText = "Update";
      this.feeForm.patchValue(this.fee);
    }
  }

  editData(cat: IFees) {
    this.feeForm.patchValue(cat);
    this.buttonText = "Update";
  }

  async deleteData(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure you want to remove?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.value) {
      try {
        let data = await this.generic.ExecuteAPI_Delete<IResponse>('Fees/DeleteClassFee?id=' + id);
        if (data.isSuccess) {
          Swal.fire('Deleted!', 'Data has been deleted', 'success');
          this.getFees();
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while deleting the data', 'error');
      } finally {
        this.buttonText = "Save";
      }
    }
  }

  async applyForAllStudents(fee: IFees) {

    try {
      let data = await this.generic.ExecuteAPI_Put<IResponse>('Fees/FeeApplyAll', fee);
      if (data.isSuccess) {
        this.toastr.success("Applied successfully for all students");
      } else {
        this.toastr.error("Failed to apply fees");
      }
    } catch (error) {

    }
  }


  public changed(e: any): void {
    let item1 = this.feeList.find(i => i.classId === e);
    if (item1) {
      this.systemService.App.searchFilter.emit(item1.className);
    } else {
      this.systemService.App.searchFilter.emit("xxxxxxxxxxxxxxxxxxxxxx");
    }
  }
}
