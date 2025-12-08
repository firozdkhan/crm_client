import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IStaffreport } from 'src/app/interfaces/staf/allstaff-report';
import { ITimeAttedanace } from 'src/app/interfaces/staf/attedancetime';
import { IEmployee } from 'src/app/interfaces/staf/staff';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-timewise-attendance',
  templateUrl: './timewise-attendance.component.html',
  styleUrl: './timewise-attendance.component.css',
})
export class TimewiseAttendanceComponent implements OnInit {
  @Input() addAll: boolean;
  addString: string = 'All';

  attendanceslist: ITimeAttedanace[] = [];
  attendances: ITimeAttedanace;
  applystudentList: IEmployee[] = [];
  applystudent: IEmployee;
  attendanceForm: FormGroup;
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

  constructor(
    private toastr: ToastrService,
    private generic: GenericService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private trans: TranslatePipe
  ) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Emp Code',ColumnName: 'staffcode',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Name',ColumnName: 'staffname',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Department',ColumnName: 'department',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Designation',ColumnName: 'designation',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Date',ColumnName: 'date',Type: 'date',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'In Time',ColumnName: 'inTime',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Out Time',ColumnName: 'outTime',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Over Time (Minutes)',ColumnName: 'overtimeMinutes',Type: 'string',Is_Sort: true,Is_Visible: true,Is_Sum: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Working hours',ColumnName: 'workingHours',Type: 'string',Is_Visible: true,Is_Sum: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Status',ColumnName: 'attendancestatus',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.attendanceForm = this.fb.group({
      id: [0, Validators.required],
      departmentId: [0, [Validators.required]],
      designationId: [0, [Validators.required]],
      fromDate: [this.today, [Validators.required]],
      toDate: [this.today, [Validators.required]],
    });
  }

  cancel() {
    this.createForm();
    this.today = new Date();
  }

  juned: any;

  async onSubmit() {
    let fromdate: string = this.datepipe.transform(
      this.attendanceForm.value.fromDate,
      'yyyy-MM-dd'
    )!;
    let todate: string = this.datepipe.transform(
      this.attendanceForm.value.toDate,
      'yyyy-MM-dd'
    )!;
    if (new Date(todate).getTime() < new Date(fromdate).getTime()) {
      Swal.fire(
        this.trans.transform('Opps!'),
        this.trans.transform('End Date must be greater than Start Date !!'),
        'error'
      );
      return;
    }

    let departmentId = this.attendanceForm.controls['departmentId'].value;
    let designationId = this.attendanceForm.controls['designationId'].value;

    if (departmentId === 'All') {
      departmentId = null;
    }
    if (designationId === 'All') {
      designationId = null;
    }

    let params = new HttpParams()
      .set('fromDate', fromdate)
      .set('toDate', todate);

    if (departmentId) {
      params = params.set('departmentId', departmentId);
    }
    if (designationId) {
      params = params.set('designationId', designationId);
    }

    try {
      let res = await this.generic.ExecuteAPI_Get<IResponse>(
        'StaffAttendanceList/PostAttendanceDate',
        params
      );

      if (res.isSuccess) {
        debugger;
        this.attendanceslist = res.data;
        this.juned = res.data;
        this.totalRecords = this.attendanceslist.length;
        console.log(this.attendanceslist);

        if (this.attendanceslist.length === 0) {
          this.toastr.warning('No records found for the selected criteria.');
        }
      } else {
        this.attendanceslist = [];
        this.totalRecords = 0;
        this.toastr.warning('No records found.');
      }
    } catch (error) {}
  }

  pageChanged(obj: any) {}
}
