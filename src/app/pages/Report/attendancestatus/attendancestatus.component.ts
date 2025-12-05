import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAttendanceStatus } from 'src/app/interfaces/Report/attendancestatus';
 
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-attendancestatus',
  templateUrl: './attendancestatus.component.html',
  styleUrl: './attendancestatus.component.css',
})
export class AttendancestatusComponent {
 attendancestatus: IAttendanceStatus[] = [];
  attendanceStatusList = ['P', 'A', 'HD', 'L', 'OT'];
  selectedStatus: string = 'P';

  gridFilter: Array<GridFilter> = [];

  constructor(
    private toastr: ToastrService,
    private generic: GenericService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private trans: TranslatePipe,
    private route: ActivatedRoute
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Name',
      ColumnName: 'staffName',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Status',
      ColumnName: 'attendanceStatus',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      const statusParam = params.get('status');
      if (statusParam) {
        this.selectedStatus = statusParam;
      }
      this.GetStaffAttendnceStatus(this.selectedStatus);
    });
  }

  async GetStaffAttendnceStatus(status: string) {
    try {
      const res = await this.generic.ExecuteAPI_Get<IResponse>(
        `StaffAttendanceList/StaffAttendanceStatus?status=${status}`
      );
      if (res && res.data && res.data.length > 0) {
        this.attendancestatus = res.data;
      } else {
        this.attendancestatus = [];
        this.toastr.warning('No data found!');
      }
    } catch (error) {
      this.toastr.error('Something went wrong');
    }
  }
}
