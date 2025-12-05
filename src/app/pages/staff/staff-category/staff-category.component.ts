import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IStaffCategory } from 'src/app/interfaces/staf/category';
import { IAttendance } from 'src/app/interfaces/student/attendance';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  Action_Type,
  Badge_Type,
  GridFilter,
} from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-category',
  templateUrl: './staff-category.component.html',
  styleUrl: './staff-category.component.css',
})
export class StaffCategoryComponent implements OnInit {
  Categoryform: FormGroup;
  CategoryeMasterList: IStaffCategory[] = [];
  Category: IStaffCategory;
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];
  today = new Date();
  changeDateformat: any;
  disable: boolean = false;
  actions: Action_Type[] = [
    {
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
    },
  ];
  buttonText: string = 'Submit';

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private genericService: GenericService,
    private datepipe: DatePipe
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Category Name',
      ColumnName: 'category',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Early Arrival Allow',
      ColumnName: 'earlyArrivalAllow',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'In Time',
      ColumnName: 'onTime',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Flexible Time',
      ColumnName: 'flexibleTime',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Late Arrival Allow',
      ColumnName: 'lateArrivalAllow',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Half Day',
      ColumnName: 'halfDay',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'lunch Time Start',
      ColumnName: 'lunchTimeStart',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Lunch Time End',
      ColumnName: 'lunchTimeEnd',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Absent',
      ColumnName: 'absent',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Early Departure Allow',
      ColumnName: 'earlyDepartureAllow',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Departure Time',
      ColumnName: 'departureTime',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Late Departure Ignor',
      ColumnName: 'lateDepartureIgnore',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Over Time Ignore',
      ColumnName: 'overTimeIgnore',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Over Time Allow',
      ColumnName: 'overTimeAllow',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Total Lunch Time',
      ColumnName: 'totalLunchTime',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Total Working Hours',
      ColumnName: 'totalWorkingHours',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Action',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });

    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  badges: Badge_Type[] = [
    { text: 'Present', condition: 'success' },
    { text: 'Half Day', condition: 'info' },
    { text: 'Late', condition: 'warning' },
    { text: 'Absent', condition: 'danger' },
  ];

  ngOnInit(): void {
    this.createCategoryform();
    this.bindAttednace();

    this.Categoryform.get('onTime').valueChanges.subscribe(() => {
      this.calculateTotalWorkingHours();
    });
    this.Categoryform.get('departureTime').valueChanges.subscribe(() => {
      this.calculateTotalWorkingHours();
    });
  }

  createCategoryform() {
    this.Categoryform = this.fb.group({
      id: [0],
      categoryId: ['', Validators.required],
      category: [''],
      earlyArrivalAllow: [''],
      onTime: [''],
      flexibleTime: [''],
      lateArrivalAllow: [''],
      halfDay: [''],
      lunchTimeStart: [''],
      lunchTimeEnd: [''],
      absent: [''],
      earlyDepartureAllow: [''],
      departureTime: [''],
      lateDepartureIgnore: [''],
      overTimeIgnore: [''],
      overTimeAllow: [''],
      totalLunchTime: [''],
      totalWorkingHours: [{ disabled: true }],
    });
  }

  async bindAttednace() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'StaffCategory/GetAllStaffCategory');
    console.log(res.data);
    if (res.isSuccess) {
      this.CategoryeMasterList = res.data;
    }
  }

  cancel() {
    this.createCategoryform();
    this.buttonText = 'Submit';
    this.today = new Date();
  }

  async onSubmit(form: FormGroup) {
    if (form.valid) {
      this.Category = this.Categoryform.value;
      let res;
      if (this.buttonText === 'Submit') {
        res = await this.genericService.ExecuteAPI_Post<IResponse>(
          'StaffCategory/AddStaffCategory',
          form.value
        );
        if (res.isSuccess) {
          this.toastrService.success(res.message);
          this.CategoryeMasterList = res.data;
          this.bindAttednace();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      } else {
        res = await this.genericService.ExecuteAPI_Put<IResponse>(
          'StaffCategory/UpdateStaffCategory',
          form.value
        );
        if (res.isSuccess) {
          this.toastrService.success(res.message);
          this.bindAttednace();
          this.cancel();
        } else {
          this.toastrService.error(res.message);

        }
      }
    }
  }

  editData(Attendance: IAttendance) {
    this.Categoryform.patchValue(Attendance);
    this.buttonText = 'Update';
  }

  async deleteData(id: number) {
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
          `StaffCategory/DeleteStaffCategory?id=${id}`
        );
        if (res.isSuccess) {
          Swal.fire('Data Delete Successfully');
          this.bindAttednace();
        }
      } catch (error) { }
    }
  }

  actionRow(RowItem: any) {
    this.Category = RowItem.item;
    this.action = RowItem.action;
    if (this.action === 'delete') {
      this.deleteData(this.Category.id);
    } else {
      // this.Category.date = this.datepipe.transform(this.Category.date, "dd MMM yyyy");
      this.buttonText = 'Update';
      this.Categoryform.patchValue(this.Category);
    }
  }

  calculateTotalWorkingHours() {
    const onTime = this.Categoryform.get('onTime').value;
    const departureTime = this.Categoryform.get('departureTime').value;

    if (onTime && departureTime) {
      const onTimeDate = new Date(`1970-01-01T${onTime}:00`);
      const departureTimeDate = new Date(`1970-01-01T${departureTime}:00`);

      const diffInMs = departureTimeDate.getTime() - onTimeDate.getTime();

      if (diffInMs > 0) {
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

        const totalHours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        this.Categoryform.get('totalWorkingHours').setValue(totalHours, { emitEvent: false });
      } else {
        this.Categoryform.get('totalWorkingHours').setValue('00:00', { emitEvent: false });
      }
    }
  }

  pageChanged(obj: any) { }
}