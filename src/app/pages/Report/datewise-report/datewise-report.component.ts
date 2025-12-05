import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IDatewise } from 'src/app/interfaces/Report/datewise';
 
import { IResponse } from 'src/app/interfaces/response';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datewise-report',
  templateUrl: './datewise-report.component.html',
  styleUrl: './datewise-report.component.css',
})
export class DatewiseReportComponent implements OnInit {
  reportlist: IDatewise[] = [];
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

  constructor(private toastr: ToastrService,private generic: GenericService,private fb: FormBuilder,private datepipe: DatePipe,private trans: TranslatePipe
  ) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Name',ColumnName: 'staff',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Attendance Time',ColumnName: 'attendanceTimes',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Date',ColumnName: 'date',Type: 'date',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Status',ColumnName: 'attendanceStatus',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.reportForm = this.fb.group({
      id: [0, Validators.required],
      attendanceStatus: [null],
      staffId: [null],
      attendanceTime: [null],
      fromDate: [this.today, [Validators.required]],
      toDate: [this.today, [Validators.required]],
    });
  }

  cancel() {
    this.createForm();
    this.today = new Date();
  }

  async onSubmit() {
    //
    let fromdate: string = this.changeDateformat.transform(
      this.reportForm.value.fromDate,
      'shortDate'
    );
    let todate: string = this.changeDateformat.transform(
      this.reportForm.value.toDate,
      'shortDate'
    );
    if (new Date(todate).getTime() < new Date(fromdate).getTime()) {
      Swal.fire(
        this.trans.transform('Opps!'),
        this.trans.transform('End Date must be greater than Start Date !!'),
        'error'
      );
      return;
    }

    if (this.reportForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    let params = new HttpParams()
      .set('staffId', this.reportForm.value.staffId)
      .set('fromedate', fromdate)
      .set('todate', todate);

    const res = await this.generic.ExecuteAPI_Get<IResponse>(
      'StaffAttendanceReport/GetStaffAttendanceReportByDateRange',
      params
    );
    if (res.isSuccess) {
      this.reportlist = res.data;
    } else {
      this.toastr.error('No data found');
    }
  }

  pageChanged(obj: any) {}
}
