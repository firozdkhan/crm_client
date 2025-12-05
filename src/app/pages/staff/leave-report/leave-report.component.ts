import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { ILeaveApply } from 'src/app/interfaces/staf/leave';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { IToastyMessage } from 'src/app/shared/interfaces/toasty-message';
import { GridFilter, Action_Type, Badge_Type } from 'src/app/shared/models/common_model';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-report',
  templateUrl: './leave-report.component.html',
  styleUrl: './leave-report.component.css'
})
export class LeaveReportComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private systemService: SystemService,
    private genericService: GenericService,
    private toaster: ToastrService,

  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: "Leave Type", ColumnName: "leave", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Staff", ColumnName: "staff", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Date", ColumnName: "applyDate", Type: "date", Is_Visible: true, Is_Price: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Durations", ColumnName: "dates", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Reason", ColumnName: "reason", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Status", ColumnName: "isApproved", Type: "badge", Badges: this.badges, Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
  }

  fileUrl: string;

  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: "", tooltip: "Approve", font: 'fal fa-check-circle', type: 'Approved' },
    { class: 'btn-outline-danger', text: "", tooltip: "Denie", font: 'fal fa-times-circle', type: 'Denied' },
  ];

  badges: Badge_Type[] = [
    { text: 'Approved', condition: 'success' },
    { text: 'Closed', condition: 'info' },
    { text: 'Pending', condition: 'warning' },
    { text: 'Denied', condition: 'danger' },
  ];

  requestList: ILeaveApply[] = [];
  request: ILeaveApply;
  items: ICommonValue[];
  suppliers: ICommonValue[];
  txtSearch = "";
  totalRecords: number;
  action: string = "new";
  buttonText: string = "Submit";
  errors: string[];
  leaveRequestForm: FormGroup;
  applyDate: Date;


  ngOnInit(): void {
    this.bindData();
    this.createStockForm();

  }

  createStockForm() {
    this.leaveRequestForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      leaveId: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      staffId: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      applyDate: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      reason: [null],
      staff: [''],

    });
  }

  cancel(): void {
    this.systemService.App.searchFilter.emit("");
    this.createStockForm();
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Staff/GetAllStaffLeave");
    if (res) {
      this.requestList = res.data;
    }
  }



  onSubmit(): void {
    if (this.action === "edit") {

      this.editField();
    }
    else {
      this.saveField();
    }
    this.action = "new";
    this.buttonText = "Submit";
  }

  pageChanged(obj: any) { }

  async editField() {
    this.request = this.leaveRequestForm.value;
    this.request.applyDate = this.applyDate.toString();
    let res = await this.genericService.ExecuteAPI_Put<IResponse>("Staff/UpadateStaffLeave", this.request);
    if (res.isSuccess) {
      this.requestList = res.data;
      this.cancel();
    }
  }

  async saveField() {
    this.request = this.leaveRequestForm.value;
    let res = await this.genericService.ExecuteAPI_Post<IResponse>("Staff/AddStffLeave", this.request);
    if (res.isSuccess) {
      this.requestList = res.data;
      this.cancel();
    }
  }



  actionRow(RowItem: any) {
    this.request = RowItem.item;
    let date1 = formatDate(new Date(), 'yyyy-MM-dd',);
    let date2 = formatDate(this.request.toDate, 'yyyy-MM-dd',);
    if (date2 > date1) {
      console.log(this.request);
      this.action = RowItem.action;
      if (this.action == "Approved" || this.action == "Denied") {
        this.updateStatusStock(this.request.id, this.action);
      }
    }
    else {
      this.toaster.error('Date Expired');
    };


  }


  updateStatusStock(id, status) {
    debugger
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Change it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      debugger
      if (result.isConfirmed) {
        let params = new HttpParams()
          .set("id", id)
          .set("status", status);
        let res = await this.genericService.ExecuteAPI_Get<IResponse>("Staff/UpdateLeaveStatus", params);
        if (res.isSuccess) {
          Swal.fire(
            'Updated!', 'Status has been updated.', 'success'
          );
          this.requestList = res.data;
          this.bindData();
        }
      }
    });
  }




  AttachementUploadResponse($event: string) {
    this.fileUrl = $event;
    this.leaveRequestForm.controls["attachment"].setValue($event);
  }
}
