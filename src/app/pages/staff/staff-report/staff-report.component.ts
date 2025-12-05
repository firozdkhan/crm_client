import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IEmployee, IStaffDocumentDto } from 'src/app/interfaces/staf/staff';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  GridFilter,
  Badge_Type,
  Action_Type,
} from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-report',
  templateUrl: './staff-report.component.html',
  styleUrl: './staff-report.component.css',
})
export class StaffReportComponent implements OnInit {
  @Input() addAll: boolean;
  constructor(
    private genericService: GenericService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private trans: TranslatePipe,
    private router: Router,
    private datepipe: DatePipe
  ) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Image',ColumnName: 'imgPath',Type: 'image',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Emp Name',ColumnName: 'empName',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Company Name',ColumnName: 'companyName',Type: 'string',Is_Sort: true,Is_Visible: false,});
    // this.gridFilter.push(<GridFilter>{DisplayText: 'Category Name',ColumnName: 'categoryName',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Department Name',ColumnName: 'departmentName',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Designation Name',ColumnName: 'designationName',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Machine Id',ColumnName: 'machineID',Type: 'string',Is_Sort: true,Is_Visible: false,});
    // this.gridFilter.push(<GridFilter>{DisplayText: 'Leave Name',ColumnName: 'leaveName',Type: 'string',Is_Sort: true,Is_Visible: false,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Address',ColumnName: 'address',Type: 'string',Is_Sort: true,Is_Visible: false,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Mobile',ColumnName: 'phoneNumber',Type: 'number',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Father Name',ColumnName: 'fatherName',Type: 'string',Is_Sort: true,Is_Visible: false,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Mother Name',ColumnName: 'motherName',Type: 'string',Is_Sort: true,Is_Visible: false,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Email',ColumnName: 'email',Type: 'string',Is_Sort: true,Is_Visible: false,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Gender',ColumnName: 'genderName',Type: 'string',Is_Sort: true,Is_Visible: false,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Post Name',ColumnName: 'staffPostName',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Staff ShiftT',ColumnName: 'shiftMasterNames',Type: 'string',Is_Sort: true,Is_Visible: false,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Action',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});

    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  buttonText: string = 'Submit';
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];

  actions: Action_Type[] = [
    {class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit',tooltip: "Edit",},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',tooltip: "Delete",},
  ];
  fileUrl = environment.Base_File_Path;
  query: string;
  totalRecords: number;
  staffReport: IEmployee[] = [];
  staff: IEmployee;
  registrationForm: FormGroup;
  departmentId: string;
  designationId: string;
  // addString: string = "All";
  imageUrl = environment.studentProfileImage;
  filUrl = environment.Base_File_Path;
  noImage = environment.noImage;
  documentList: IStaffDocumentDto[] = [];
  changeDateformat: any;
  employeelist: IEmployee[] = [];

  ngOnInit(): void {
    this.createForm();
    this.bindStaff();
  }

  async bindStaff() {
    try {
      const res = await this.genericService.ExecuteAPI_Get<IResponse>(
        'Staff/GetAllStaff'
      );
      if (res && res.data) {
        this.employeelist = res.data;
        this.staffReport = this.employeelist;
        this.totalRecords = this.staffReport.length;
      }
    } catch (error) { }
  }

  async loadStaff() {
    if (this.registrationForm.invalid) {
      this.toastrService.warning('Please select valid criteria.');
      return;
    }

    const departmentId = this.registrationForm.controls['departmentId'].value;
    const designationId = this.registrationForm.controls['designationId'].value;

    this.staffReport = this.employeelist.filter(
      (staff) =>
        (departmentId === 'All' || staff.departmentId === departmentId) &&
        (designationId === 'All' || staff.designationId === designationId)
    );

    this.totalRecords = this.staffReport.length;

    if (this.staffReport.length === 0) {
      this.toastrService.warning('No records found for the selected criteria.');
    }
  }

  createForm() {
    this.registrationForm = this.fb.group({
      departmentId: [null, Validators.required],
      designationId: [null, Validators.required],
    });
  }

  reset() {
    this.registrationForm.reset();
    this.staffReport = this.employeelist;
    this.totalRecords = this.employeelist.length;
  }

  async deleteData(id: number) {
    //
    const result = await Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        let res = await this.genericService.ExecuteAPI_Delete<IResponse>(
          `Staff/DeleteStaff?id=${id}`
        );
        if (res)
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your imaginary file has been deleted.'),
            'success'
          );
        this.staffReport = this.staffReport.filter((x) => x.id != id);
      } catch (error) { }
    }
  }

  actionRow(RowItem: any) {
    this.staff = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteData(this.staff.id);
    } else if (this.action === 'edit') {
      this.router.navigate(['staff/add-staff'], {
        queryParams: { staffId: this.staff.id },
      });
      this.buttonText = 'Update';
    } else {
      this.buttonText = 'Update';
      this.imageUrl = this.filUrl + this.staff.imgPath;

      if (
        this.staff.imgPath === null ||
        this.staff.imgPath === 'temp/null' ||
        this.staff.imgPath === ''
      ) {
        this.imageUrl = this.noImage;
      }

      this.documentList = this.staff.staffDocuments;
      this.staff.dateOfJoining = this.datepipe.transform(
        this.staff.dateOfJoining,
        'dd MMM yyyy'
      );
      this.staff.dob = this.datepipe.transform(this.staff.dob, 'dd MMM yyyy');
      this.registrationForm.patchValue(this.staff);
    }
  }

  pageChanged(obj: any) { }
}
