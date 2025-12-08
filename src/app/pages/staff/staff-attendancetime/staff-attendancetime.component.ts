import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { ITimeAttedanace } from 'src/app/interfaces/staf/attedancetime';
import { GenericService } from 'src/app/services/generic.service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-staff-attendancetime',
  templateUrl: './staff-attendancetime.component.html',
  styleUrl: './staff-attendancetime.component.css',
})
export class StaffAttendancetimeComponent implements OnInit {
  @Input() addAll: boolean;
  addString: string = 'All';
  attendaceStatus: ICommonValue[] = [
    { id: 'P', name: 'Present' },
    { id: 'A', name: 'Absent' },
    { id: 'L', name: 'Late' },
    { id: 'HD', name: 'Half Day' },
  ];

  AttendanceList: ITimeAttedanace[] = [];
  Attendance: ITimeAttedanace;
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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.applyForm = this.fb.group({
      id: [0],
      departmentId: [0, [Validators.required]],
      designationId: [0, [Validators.required]],
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

    const attendance = applyForm.value;
    const localDate = new Date(attendance.date);
    const formattedDate = `${localDate.getFullYear()}-${(localDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;

    const params = new HttpParams()
      .set('departmentId', attendance.departmentId)
      .set('designationId', attendance.designationId)
      .set('date', formattedDate);
    let res = await this.generic.ExecuteAPI_Get<IResponse>(
      'StaffAttendanceList/GetStaffForManualAttendace_Time',
      params
    );
    if (res.isSuccess) {
      this.AttendanceList = res.data.map((item) => ({
        ...item,
        inTime: item.inTimeString,
        outTime: item.outTimeString,
      }));
    }
    if (this.AttendanceList.length === 0) {
      this.toastr.warning('No records found for the selected criteria.');
    } else {
    }
  }

  async submitAttendance() {
    debugger
    //
    let attendanceData: ITimeAttedanace[] = this.AttendanceList.map((item) => ({
      id: 0,
      staffId: item.staffId,
      empName: item.empName,
      empCode: item.empCode,
      attendanceStatus: item.attendanceStatus,
      departmentName: item.departmentName,
      designationName: item.designationName,
      departmentId: item.departmentId,
      designationId: item.designationId,
      date: item.date,
      inTime: item.inTime ? item.date.replace('00:00:00', item.inTime) : null,
      outTime: item.outTime ? item.date.replace('00:00:00', item.outTime) : null,
      inTimeString: item.inTimeString,
      outTimeString: item.outTimeString,
      workingHours: item.workingHours,
      shiftMasterId: item.shiftMasterId,
      shiftName: item.shiftName,
    }));
    let res = await this.generic.ExecuteAPI_Post<IResponse>(
      'StaffAttendanceList/AddStaffAttendanceList_Time',
      attendanceData
    );
    if (res.isSuccess) {
      this.toastr.success('Attendance has been saved successfully.');
      this.cancel();
    } else {
      this.toastr.error('Failed to save attendance.');
    }
  }

  updateTime(staffId: number, timeField: string, timeValue: string) {
    debugger
    console.log(staffId);
    const student = this.AttendanceList.find(
      (item) => item.staffId === staffId
    );
    if (student) {
      student[timeField] = timeValue;
    }
  }

  pageChanged(obj: any) { }
}
