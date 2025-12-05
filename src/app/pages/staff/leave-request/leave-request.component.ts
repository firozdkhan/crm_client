import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { ILeaveApply } from 'src/app/interfaces/staf/leave';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { IToastyMessage } from 'src/app/shared/interfaces/toasty-message';
import {
  GridFilter,
  Action_Type,
  Badge_Type,
} from 'src/app/shared/models/common_model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css',
})
export class LeaveRequestComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private genericService: GenericService,
    private toaster: ToastrService,
    private datepipe: DatePipe,
    private trans: TranslatePipe
  ) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Leave Type',ColumnName: 'leave',Type: 'string',Is_Visible: true,Is_Sort: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Staff',ColumnName: 'staff',Type: 'string',Is_Visible: true,Is_Sort: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Date',ColumnName: 'applyDate',Type: 'date',Is_Visible: true,Is_Sort: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Durations',ColumnName: 'dates',Type: 'string',Is_Visible: true,Is_Sort: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Reason',ColumnName: 'reason',Type: 'string',Is_Visible: true,Is_Sort: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Status',ColumnName: 'isApproved',Type: 'badge',Badges: this.badges,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Edit',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});

    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }
  startDate: Date;
  endDate: Date;
  fileUrl: string;
  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [{class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit',},{class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',},];

  badges: Badge_Type[] = [
    { text: 'Approved', condition: 'success' },
    { text: 'Closed', condition: 'info' },
    { text: 'Pending', condition: 'warning' },
    { text: 'Denied', condition: 'danger' },
  ];

  changeDateformat: any;
  requestList: ILeaveApply[] = [];
  request: ILeaveApply;
  items: ICommonValue[];
  suppliers: ICommonValue[];
  txtSearch = '';
  totalRecords: number;
  action: string = 'new';
  buttonText: string = 'Submit';
  errors: string[];
  leaveRequestForm: FormGroup;
  applyDate: Date;
  today = new Date();

  ngOnInit(): void {
    this.bindData();
    this.createStockForm();

    this.leaveRequestForm.get('staffId')?.valueChanges.subscribe(staffId => {
      let leaveId = this.leaveRequestForm.get('leaveId')?.value;
      if (staffId && leaveId) {
        this.GetStaffleave(staffId, leaveId);
      }
    });

    this.leaveRequestForm.get('leaveId')?.valueChanges.subscribe(leaveId => {
      let staffId = this.leaveRequestForm.get('staffId')?.value;
      if (staffId && leaveId) {
        this.GetStaffleave(staffId, leaveId);
      }
    });
  }

  createStockForm() {
    this.leaveRequestForm = this.fb.group({
      id: [0,[Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
      leaveId: [null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
      staffId: [null,[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
      fromDate: [this.today, [Validators.required]],
      toDate: [this.today, [Validators.required]],
      reason: [null],
      applyDate: [null],
      staff: [''],
      isApproved: [''],


      //naye fields
      assignedLeave: [{ value: 0, disabled: true }],
      approvedLeave: [{ value: 0, disabled: true }],
      remainingLeave: [{ value: 0, disabled: true }],
    });
  }

  cancel(): void {
    this.systemService.App.searchFilter.emit('');
    this.createStockForm();
    this.bindData();
    this.today = new Date();
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Staff/GetAllStaffLeave'
    );
    if (res) {
      this.requestList = res.data;
    }
  }

  onSubmit(): void {
    const fromDate: Date = new Date(this.leaveRequestForm.value.fromDate);
    const toDate: Date = new Date(this.leaveRequestForm.value.toDate);

    if (toDate < fromDate) {
      Swal.fire(
        this.trans.transform('Opps!'),
        this.trans.transform('End Date must be greater than Start Date !!'),
        'error'
      );
      return;
    }

    if (this.action === 'edit') {
      this.editField();
    } else {
      this.saveField();
    }

    this.action = 'new';
    this.buttonText = 'Submit';
  }
  pageChanged(obj: any) { }

  async editField() {
    debugger;
    //
    this.request = this.leaveRequestForm.value;
    // this.request.staffId = this.request.staffId.toString();
    this.request.fromDate = this.changeDateformat.transform(
      this.request.fromDate,
      'dd MMM yyyy'
    );
    this.request.toDate = this.changeDateformat.transform(
      this.request.toDate,
      'dd MMM yyyy'
    );
    this.request.applyDate = this.applyDate?.toString();

    let res = await this.genericService.ExecuteAPI_Put<IResponse>(
      'Staff/UpdateStaffLeave',
      this.request
    );
    if (res.isSuccess) {
      this.toaster.success(res.message);
      this.cancel();
      this.bindData();
      this.GetStaffleave(this.request.staffId, this.request.leaveId);

    } else {
      this.toaster.error(res.message);
    }
  }

  async saveField() {
    this.request = this.leaveRequestForm.value;
    // this.request.staffId = this.request.staffId.toString();
    this.request.fromDate = this.changeDateformat.transform(
      this.request.fromDate,
      'dd MMM yyyy'
    );
    this.request.toDate = this.changeDateformat.transform(
      this.request.toDate,
      'dd MMM yyyy'
    );
    let res = await this.genericService.ExecuteAPI_Post<IResponse>(
      'Staff/AddStffLeave',
      this.request
    );
    if (res.isSuccess) {
      this.toaster.success(res.message);
      this.cancel();
      this.bindData();
    } else {
      this.toaster.error(res.message);
    }
  }

  actionRow(RowItem: any) {
    this.request = RowItem.item;
    this.action = RowItem.action;
    this.request.toDate = this.datepipe.transform(
      this.request.toDate,
      'dd MMM yyyy'
    );
    this.request.fromDate = this.datepipe.transform(
      this.request.fromDate,
      'dd MMM yyyy'
    );
    this.request.applyDate = this.datepipe.transform(
      this.request.applyDate,
      'dd MMM yyyy'
    );
    if (this.action === 'edit') {
      this.buttonText = 'Update';
      this.leaveRequestForm.patchValue(this.request);
      console.log('Staff ID:', this.request.staffId);
    }

    if (this.action === 'delete') {
      this.deleteStaff(this.request.id);
    }
  }
  deleteStaff(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await this.genericService.ExecuteAPI_Delete<IResponse>(
            `Staff/DeleteStaffLeave?id=${id}`
          );
          if (res.isSuccess) {
            Swal.fire(
              this.trans.transform('Deleted!'),
              this.trans.transform('Your imaginary file has been deleted.'),
              'success'
            );
            this.bindData();
          } else {
            this.toaster.error(res.message);
          }
        } catch { }
      }
    });
  }

  AttachementUploadResponse($event: string) {
    this.fileUrl = $event;
    this.leaveRequestForm.controls['attachment'].setValue($event);
  }
  ////////////////////////////// Get Staff Leave Days ///////////////////

 async GetStaffleave(staffId: number, leaveId: number) {
  debugger;
  let res = await this.genericService.ExecuteAPI_Get<IResponse>(
    `Staff/GetStaffLeaveStatus?staffId=${staffId}&leaveid=${leaveId}`
  );

  if (res.isSuccess) {
    if (res.data && (res.data.assignedLeave || res.data.approvedLeave || res.data.remainingLeave)) {
      this.leaveRequestForm.patchValue({
        assignedLeave: res.data.assignedLeave,
        approvedLeave: res.data.approvedLeave,
        remainingLeave: res.data.remainingLeave,
      });
    } else {

      this.leaveRequestForm.patchValue({
        assignedLeave: 0,
        approvedLeave: 0,
        remainingLeave: 0,
      });
    }
  } else {
    console.error("Error: ", res.message);
    this.leaveRequestForm.patchValue({
      assignedLeave: 0,
      approvedLeave: 0,
      remainingLeave: 0,
    });
  }
}
}
