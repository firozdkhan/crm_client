import { Component, OnInit } from '@angular/core';
import { IResponse } from 'src/app/interfaces/response';
import { IEmployee } from 'src/app/interfaces/staf/staff';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter, Badge_Type } from 'src/app/shared/models/common_model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-staff-report',
  templateUrl: './staff-report.component.html',
  styleUrl: './staff-report.component.css'
})
export class StaffReportComponent implements OnInit {

  constructor(
    private genericService: GenericService
  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: "Name", ColumnName: "name", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Designation", ColumnName: "designationName", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Department", ColumnName: "departmentName", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Gender", ColumnName: "gender", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Joining Date", ColumnName: "joiningDate", Type: "date", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "DOB", ColumnName: "dob", Type: "date", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Father Name", ColumnName: "fatherName", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Maritial Status", ColumnName: "maritalStatus", Type: "number", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Mobile Number", ColumnName: "mobileNo", Type: "number", Badges: this.badges, Is_Visible: true, Is_Sort: true });


  }
  badges: Badge_Type[] = [
    { text: 'Pending', condition: 'warning' },
    { text: 'Returned', condition: 'success' }
  ];

  gridFilter: Array<GridFilter> = [];
  fileUrl = environment.Base_File_Path;
  query: string;
  totalRecords: number;
  staffReport: IEmployee[];


  ngOnInit(): void {
    this.bindData();
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Staff/GetAllEmployee");
    if (res) {
      this.staffReport = res.data;
      this.totalRecords = this.staffReport.length;
    }
  }

  pageChanged(obj: any) { }


}
