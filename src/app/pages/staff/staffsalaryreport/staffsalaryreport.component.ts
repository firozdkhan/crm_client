import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { ISalary } from 'src/app/interfaces/staf/salary';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-staffsalaryreport',
  templateUrl: './staffsalaryreport.component.html',
  styleUrl: './staffsalaryreport.component.css'
})
export class StaffsalaryreportComponent {

  salarylist: ISalary[] = [];
  salarylists: ISalary;
  buttonText: string = 'Submit';
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];
  reportForm!: FormGroup;

  imageUrl = environment.studentProfileImage;
  filUrl = environment.Base_File_Path;
  noImage = environment.noImage;

  actions: Action_Type[] = [
    // {
    //   class: 'btn-outline-primary',
    //   text: null,
    //   font: 'fal fa-edit',
    //   type: 'edit',
    //   tooltip: "Edit",
    // },
    // {
    //   class: 'btn-outline-danger',
    //   text: null,
    //   font: 'fal fa-trash-alt',
    //   type: 'delete',
    //   tooltip: "Delete",
    // },
    {
      class: 'btn-outline-success',
      text: null,
      font: 'fal fa-print',
      type: 'print',
      tooltip: "Print",
    },
  ];



  constructor(private genericService: GenericService, private toastrService: ToastrService, private fb: FormBuilder, private route: ActivatedRoute, private trans: TranslatePipe,
    private router: Router,
    private datepipe: DatePipe) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Image', ColumnName: 'imgPath', Type: 'image', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Staff Name', ColumnName: 'staffName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Department', ColumnName: 'departmentName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Designation', ColumnName: 'designationName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Basic Salary', ColumnName: 'basicSalary', Type: 'number', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Payment', ColumnName: 'paymentMode', Type: 'number', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Month', ColumnName: 'salaryMonthName', Type: 'number', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Absent Days', ColumnName: 'absentDays', Type: 'number', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Payed', ColumnName: 'advance', Type: 'number', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Remaning Salary', ColumnName: 'remaning', Type: 'number', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Issue Date', ColumnName: 'issueDate', Type: 'date', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true, })
  }


  ngOnInit(): void {
    this.bindStaff();

    this.reportForm = this.fb.group({
      staffId: [null],
      fromDate: [null],
    });
  }

  async bindStaff() {
    try {
      let staffId = 0;
      let month = new Date().getMonth() + 1;

      const res = await this.genericService.ExecuteAPI_Get<IResponse>(`StaffSalary/Get_StaffSalary_ByStaffAndMonth?staffId=${staffId}&month=${month}`);

      if (res && res.data) {
        this.salarylist = res.data;
      }
    } catch (error) { }

  }
  onSubmit() {
    if (this.reportForm.valid) {
      const staffId = this.reportForm.value.staffId;
      const date = this.reportForm.value.fromDate;

      if (!date) {
        this.toastrService.warning("Please select month");
        return;
      }


      const month = new Date(date).getMonth() + 1;

      this.genericService.ExecuteAPI_Get<IResponse>(`StaffSalary/Get_StaffSalary_ByStaffAndMonth?staffId=${staffId}&month=${month}`).then(res => {
        if (res && res.data) {
          this.salarylist = res.data;
        } else {
          this.salarylist = [];
        }
      });
    }

  }

  cancel() {
    this.reportForm.reset();
    this.bindStaff();
    this.buttonText = 'Submit';
  }

  actionRow(RowItem: any) {
    this.salarylists = RowItem.item as ISalary;
    this.action = RowItem.action;

    if (this.action === 'print') {
      const staffId = this.salarylists.staffId;
      let month: number;


      if (!isNaN(Number(this.salarylists.salaryMonth))) {
        month = Number(this.salarylists.salaryMonth);
      } else {

        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        month = monthNames.findIndex(m =>
          m.toLowerCase() === this.salarylists.salaryMonth.toLowerCase()
        ) + 1;
      }

      const year = new Date().getFullYear();

      this.router.navigate(['reports/salaryslip'], {
        queryParams: {
          staffId: staffId,
          month: month,
          year: year
        },
      });
    }
  }


}
