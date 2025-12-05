import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';

@Component({
  selector: 'app-staffattendancereport',
  templateUrl: './staffattendancereport.component.html',
  styleUrls: ['./staffattendancereport.component.css']
})
export class StaffattendancereportComponent implements OnInit {

  gridFilter: Array<GridFilter> = [];
  attendanceForm: FormGroup;
  reportdata: any[] = [];
  today = new Date();

  actions: Action_Type[] = [
    { class: 'btn-outline-info', text: null, tooltip: 'Location Report', font: 'fal fa-file-alt', type: 'report' },
  ];

  monthsList: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generic: GenericService,
    private fb: FormBuilder
  ) {
    // Grid filter define
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Name', ColumnName: 'staffname', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Department', ColumnName: 'department', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Designation', ColumnName: 'designation', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Date', ColumnName: 'date', Type: 'date', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'In Time', ColumnName: 'inTime', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Out Time', ColumnName: 'outTime', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Working Hours', ColumnName: 'workingHours', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Over Time in min.', ColumnName: 'overtimeMinutes', Type: 'string', Is_Sort: true, Is_Visible: true, Is_Sum: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Latitute', ColumnName: 'latitude', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Longitude', ColumnName: 'longitude', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'In Location', ColumnName: 'address', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Out Location', ColumnName: 'outAddress', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Status', ColumnName: 'attendancestatus', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true, });

  }

  ngOnInit(): void {
    this.createForm();
    this.GetStaffLocationData();
  }

  createForm() {
    this.attendanceForm = this.fb.group({
      staffId: [null, Validators.required],
      dateOfJoining: [this.today, Validators.required]
    });
  }

  async GetStaffAttendanceData(staffId: number, month: number, year: number) {
    try {
      let res = await this.generic.ExecuteAPI_Get<IResponse>(
        `StaffAttendanceList/GetAttendanceDetailReport?staffId=${staffId}&month=${month}&year=${year}`
      );

      if (res.isSuccess) {
        this.reportdata = res.data;
      } else {
        console.warn(res.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  onSubmit() {
    if (this.attendanceForm.valid) {
      const staffId = this.attendanceForm.value.staffId;
      const date = new Date(this.attendanceForm.value.dateOfJoining);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      this.GetStaffAttendanceData(staffId, month, year);
    }
  }


  reset() {
    this.attendanceForm.reset({
      staffId: null,
      dateOfJoining: this.today
    });
    this.reportdata = [];
  }

  ///// Test ///// Data
  juned: any[]
  async GetStaffLocationData () {
    try {
      let res = await this.generic.ExecuteAPI_Get<IResponse>(
        `StaffAttendanceList/GetStaffLocationList?staffId=${1436 }&fromdate=${'2025/09/19'}&todate=${'2025/09/19'}`
      );

      if (res.isSuccess) {
        this.juned = res.data;
      } else {
        console.warn(res.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}
