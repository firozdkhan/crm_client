import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attedetailreport',
  templateUrl: './attedetailreport.component.html',
  styleUrls: ['./attedetailreport.component.css'],
})
export class AttedetailreportComponent implements OnInit {
  staffId: any;
  month: any;
  year: any;
  reportdata: any[] = [];
  gridFilter: Array<GridFilter> = [];
  action: string = 'new';
  reportForm: any;
  monthform!: FormGroup;

  actions: Action_Type[] = [
    { class: 'btn-outline-info', text: null, tooltip: 'View Report', font: 'fal fa-file-alt', type: 'report' },
  ];

  monthsList: string[] = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private route: ActivatedRoute,private router: Router,private generic: GenericService,private fb: FormBuilder
  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Name', ColumnName: 'staffname', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Department', ColumnName: 'department', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Designation', ColumnName: 'designation', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Date', ColumnName: 'date', Type: 'date', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'In Time', ColumnName: 'inTime', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Out Time', ColumnName: 'outTime', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Working Hours', ColumnName: 'workingHours', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Over Time in min.', ColumnName: 'overtimeMinutes', Type: 'string', Is_Sort: true, Is_Visible: true, Is_Sum: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Latitute', ColumnName: 'latitude', Type: 'string', Is_Sort: true, Is_Visible: true  });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Longitude', ColumnName: 'longitude', Type: 'string', Is_Sort: true, Is_Visible: true   });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'In Location', ColumnName: 'address', Type: 'string', Is_Sort: true, Is_Visible: true  });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Out Location', ColumnName: 'outAddress', Type: 'string', Is_Sort: true, Is_Visible: true});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Status', ColumnName: 'attendancestatus', Type: 'string', Is_Sort: true, Is_Visible: true });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.staffId = +params['staffId'];
      this.month = +params['month'];
      this.year = +params['year'];


      this.monthform = this.fb.group({
        selectedMonth: [this.month]
      });

      if (this.staffId && this.month && this.year) {
        this.GetStaffAttendanceData(this.staffId, this.month, this.year);
      }


      this.monthform.get('selectedMonth')?.valueChanges.subscribe((newMonth) => {
        if (newMonth) {
          this.month = newMonth;


          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { staffId: this.staffId, month: this.month, year: this.year },
            queryParamsHandling: 'merge',
          });

          this.GetStaffAttendanceData(this.staffId, this.month, this.year);
        }
      });
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
}
