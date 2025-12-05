import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IStaffAttenance } from 'src/app/interfaces/staf/staff-attendace';
import { IAttendance } from 'src/app/interfaces/student/attendance';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  Action_Type,
  Badge_Type,
  GridFilter,
} from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-attendace',
  templateUrl: './staff-attendace.component.html',
  styleUrl: './staff-attendace.component.css',
})
export class StaffAttendaceComponent implements OnInit {
  Attendanceform: FormGroup;
  AttendanceMasterList: IStaffAttenance[] = [];
  Attendance: IStaffAttenance;
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];
  today = new Date();
  changeDateformat: any;

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
  buttonText: string = 'Submit';

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private genericService: GenericService,
    private datepipe: DatePipe,
    private trans: TranslatePipe
  ) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Staff Name',ColumnName: 'staff',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Date',ColumnName: 'date',Type: 'date',Is_Sort: true, Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'In Time',ColumnName: 'inTime',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Out Time',ColumnName: 'outTime',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Status',ColumnName: 'status',Type: 'badge',Badges: this.badges,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Action',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});
    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  badges: Badge_Type[] = [
    { text: 'Present', condition: 'success' },
    { text: 'Half day', condition: 'info' },
    { text: 'Late', condition: 'warning' },
    { text: 'Absent', condition: 'danger' },
  ];

  ngOnInit(): void {
    this.createAttendanceform();
    this.bindAttednace();
  }

  createAttendanceform() {
    this.Attendanceform = this.fb.group({
      id: [0],
      staffId: ['', Validators.required],
      staff: [''],
      date: [this.today, Validators.required],
      inTime: [''],
      outTime: [''],
      statusId: [''],
      status: [''],
    });
  }

  async bindAttednace() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'StaffAttendance/GetAllStaffAttendance'
    );
    if (res.isSuccess) {
      this.AttendanceMasterList = res.data;
    }
  }

  cancel() {
    this.createAttendanceform();
    this.buttonText = 'Submit';
    this.today = new Date();
  }

  async onSubmit(form: FormGroup) {
    debugger;
    if (form.valid) {
      this.Attendance = this.Attendanceform.value;
      this.Attendance.date = this.changeDateformat.transform(
        this.Attendance.date
      );
      let res;
      if (this.buttonText === 'Submit') {
        res = await this.genericService.ExecuteAPI_Post<IResponse>(
          'StaffAttendance/AddStaffAttendance',
          form.value
        );
        if (res.isSuccess) {
          this.toastrService.success(res.message);
          this.AttendanceMasterList = res.data;
          this.bindAttednace();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      } else {
        res = await this.genericService.ExecuteAPI_Put<IResponse>(
          'StaffAttendance/UpdateStaffAttendance',
          form.value
        );
        if (res.isSuccess) {
          this.toastrService.success(res.message);
          this.bindAttednace();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      }
    }
  }

  editData(Attendance: IAttendance) {
    this.Attendanceform.patchValue(Attendance);
    this.buttonText = 'Update';
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
          `StaffAttendance/DeleteStaffAttendance?id=${id}`
        );
        if (res.isSuccess) {
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your imaginary file has been deleted.'),
            'success'
          );
          this.bindAttednace();
        }
      } catch (error) {}
    }
  }

  actionRow(RowItem: any) {
    this.Attendance = RowItem.item;
    this.action = RowItem.action;
    if (this.action === 'delete') {
      this.deleteData(this.Attendance.id);
    } else {
      this.Attendance.date = this.datepipe.transform(
        this.Attendance.date,
        'dd MMM yyyy'
      );
      this.buttonText = 'Update';
      this.Attendanceform.patchValue(this.Attendance);
    }
  }
  pageChanged(obj: any) {}
}
