import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { IAllStaffAttendance } from 'src/app/interfaces/staf/allstaff-attendane';
import { GenericService } from 'src/app/services/generic.service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-allstaff-attendance',
  templateUrl: './allstaff-attendance.component.html',
  styleUrls: ['./allstaff-attendance.component.css'],
})
export class AllstaffAttendanceComponent implements OnInit {
  @Input() addAll: boolean;
  addString: string = 'All';
  attendaceStatus: ICommonValue[] = [
    { id: 'P', name: 'Present' },
    { id: 'A', name: 'Absent' },
    { id: 'L', name: 'Late' },
    { id: 'HD', name: 'Half Day' },
  ];

  AttendanceList: IAllStaffAttendance[] = [];
  Attendance: IAllStaffAttendance;
  applyForm: FormGroup;
  buttonText: string = 'Show';
  apiUrl = environment.apiUrl;
  isDisabled: boolean = true;
  today = new Date();
  totalRecords: number;
  pipe = new DatePipe('en-IN');

  constructor(
    private toastr: ToastrService,
    private generic: GenericService,
    private fb: FormBuilder,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.applyForm = this.fb.group({
      id: [0],
      departmentId: [null, [Validators.required]],
      designationId: [null, [Validators.required]],
      date: [this.today, [Validators.required]],
    });
  }

  cancel() {
    this.createForm();
    this.AttendanceList = [];
    this.isDisabled = true;
    this.today = new Date();
  }

  async onSubmit(applyForm) {
    debugger;
    const attendance = applyForm.value;
    // const formattedDate = new Date(attendance.date).toISOString().split('T')[0];
    // const formattedDate = this.datepipe.transform(
    //   new Date(attendance.date),
    //   'dd/MM/yyyy'
    // );
    const formattedDate = this.datepipe.transform(
      attendance.date,
      'yyyy-MM-dd'
    );

    const params = new HttpParams()
      .set('departmentId', attendance.departmentId)
      .set('designationId', attendance.designationId)
      .set('date', formattedDate);
    console.log(formattedDate);
    let res = await this.generic.ExecuteAPI_Get<IResponse>(
      'StaffAttendanceList/GetStaffForManualAttendace',
      params
    );
    if (res.isSuccess) {
      this.AttendanceList = res.data;
    }
    if (this.AttendanceList.length === 0) {
      this.toastr.warning('No records found for the selected criteria.');
    } else {
      // this.toastr.error(res.message);
    }
  }
  async submitAttendance() {
    debugger;
    let attendanceData: IAllStaffAttendance[] = this.AttendanceList.map(
      (item) => ({
        id: 0,
        staffId: item.staffId,
        empName: item.empName,
        empCode: item.empCode,
        attendanceStatus: item.attendanceStatus,
        date: item.date, // id: 0,
        // staffId: item.id,
        // staff: null,
        // staffShiftMasterId: item.staffShiftMasterId,
        // // shiftMasterID: item.shiftMasterID,
        // staffMachineNames: null,
        // date: this.applyForm.value.date,
        // attendanceStatus: item.attendanceStatus,
        // attendanceTimes: null,
        // inTime: null,
        // outTime: null
      })
    );
    //
    let res = await this.generic.ExecuteAPI_Post<IResponse>(
      'StaffAttendanceList/AddStaffAttendanceList',
      attendanceData
    );
    if (res.isSuccess) {
      this.AttendanceList = res.data;
      this.toastr.success('Attendance has been saved successfully.');
      this.cancel();
    } else {
      this.toastr.error('Failed to save attendance.');
    }
  }

  radioChecked(id: number, status: string) {
    debugger;
    const student = this.AttendanceList.find((item) => item.staffId === id);
    if (student && student.staffId) {
      student.attendanceStatus = status;
    }
  }

  pageChanged(obj: any) {}
}
