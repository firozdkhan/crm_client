import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDatewise } from 'src/app/interfaces/Report/datewise';
import { IMonthaly } from 'src/app/interfaces/Report/monthly';
 
import { IResponse } from 'src/app/interfaces/response';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-monthwise-report',
  templateUrl: './monthwise-report.component.html',
  styleUrl: './monthwise-report.component.css',
})
export class MonthwiseReportComponent implements OnInit {
  isMultiple = false;
  monthsList: string[] = ['January','February','March','April','May','June','July','August','September','October','November','December',];
  reportlist: IMonthaly[] = [];
  reports: IDatewise;
  reportForm: FormGroup;
  buttonText: string = 'Show';
  apiUrl = environment.apiUrl;
  headers_object: HttpHeaders;
  totalRecords: number;
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];
  startDate: Date;
  endDate: Date;
  changeDateformat: any;
  today = new Date();
  actions: Action_Type[] = [{class: 'btn-outline-info',text: null,tooltip: 'View Report',font: 'fal fa-file-alt',type: 'report',},
    // {class: 'btn-outline-success',text: null,tooltip: 'View Salary Slip',font: 'fal fa-file-alt',type: 'salary',},
  ];

  constructor(private toastr: ToastrService,private generic: GenericService,private fb: FormBuilder,private datepipe: DatePipe,private router: Router) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Name', ColumnName: 'staffName', Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Shift',ColumnName: 'shiftName',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Total Days',ColumnName: 'totalCompanyWorkingDays',Type: 'number',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Total Hours',ColumnName: 'totalCompanyOpenHours',Type: 'number',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Present',ColumnName: 'totalStaffAttendanceDays',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Staff Hours',ColumnName: 'totalWorkingHours',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Absent',ColumnName: 'totalAbsent',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Half Days',ColumnName: 'totalHalfDay',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'OT in min.',ColumnName: 'totalOvertimeMinutes',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'OT Days.',ColumnName: 'overtimeDays',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'No. of Late',ColumnName: 'totalLateDays',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'After Total Absent',ColumnName: 'adjustedAbsentDays',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Total Present',ColumnName: 'totalPresentIncludingOvertime',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Extra Days',ColumnName: 'extraDays',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Action',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});
    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  ngOnInit() {
    this.createForm();

    this.reportForm.get('fromDate')?.valueChanges.subscribe((date: Date) => {
      if (date) {
        const month = new Date(date).getMonth() + 1;
        const year = new Date(date).getFullYear();
        this.GetWorkingDays(month, year);
      }
    });
  }

  createForm() {
    this.reportForm = this.fb.group({
      staffId: [null, Validators.required],
      fromDate: [null, Validators.required],
      totalCompanyWorkingDays: [0, Validators.required],
    });
  }

  cancel() {
    this.createForm();
    this.today = new Date();
  }
  async onSubmit() {
    if (this.reportForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    const selectedDate: Date = this.reportForm.value.fromDate;
    const month = new Date(selectedDate).getMonth() + 1;
    const year = new Date(selectedDate).getFullYear();

    let params = new HttpParams()
      .set('staffId', this.reportForm.value.staffId)
      .set('month', month.toString())
      .set('year', year.toString())
      .set('totalCompanyWorkingDays', this.reportForm.value.totalCompanyWorkingDays);

    const res = await this.generic.ExecuteAPI_Get<IResponse>(
      'StaffAttendanceReport/GetMonthlyAttendanceSummary',
      params
    );

    if (res.isSuccess) {
      this.reportlist = Array.isArray(res.data) ? res.data : [res.data];
    } else {
      this.toastr.error('No data found');
    }
  }


  actionRow(RowItem: any) {
    debugger;
    const item = RowItem.item;
    const actionType = RowItem.action;

    if (actionType === 'report') {
      const staffId = item.staffId;


      const selectedDate: Date = this.reportForm.value.fromDate;
      if (!selectedDate) {
        alert("Please select Date first!");
        return;
      }

      const month = new Date(selectedDate).getMonth() + 1;
      const year = new Date(selectedDate).getFullYear();

      console.log("From Form => Staff:", staffId, "Month:", month, "Year:", year);

      this.router.navigate(['reports/attedetailreport'], {
        queryParams: {
          staffId: staffId,
          month: month,
          year: year
        },
      });
    }
  }
  workingDaysData: any

  async GetWorkingDays(month: number, year: number) {
    try {
      let res: any = await this.generic.ExecuteAPI_Get<IResponse>(
        `StaffAttendanceReport/GetMonthWiseWorkingDays?month=${month}&year=${year}`
      );

      if (res.isSuccess) {
        this.reportForm.patchValue({
          totalCompanyWorkingDays: res.data.workingDays
        });
        this.workingDaysData = res.data;
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  }
  pageChanged(obj: any) { }

}
