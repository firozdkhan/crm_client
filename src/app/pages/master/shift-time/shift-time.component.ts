import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IShiftCategory } from 'src/app/interfaces/master/shift-category';
import { IResponse } from 'src/app/interfaces/response';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  Action_Type,
  Badge_Type,
  GridFilter,
} from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shift-time',
  templateUrl: './shift-time.component.html',
  styleUrls: ['./shift-time.component.css'],
})
export class ShiftTimeComponent implements OnInit {
  @ViewChild('goUp', { static: true }) contentPage: ElementRef;
  Categoryform: FormGroup;
  CategoryeMasterList: IShiftCategory[] = [];
  Category: IShiftCategory;
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];
  today = new Date();
  changeDateformat: any;
  actions: Action_Type[] = [
    {
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
      tooltip: "Edit",
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
      tooltip: "Delete",
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
      DisplayText: 'Shift Name And Time',
      ColumnName: 'shiftNameAndTime',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'In Time',
      ColumnName: 'inTime',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Out Time',
      ColumnName: 'outTime',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Total Time',
      ColumnName: 'totalTime',
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

  it: Date;

  ngOnInit(): void {
    this.createCategoryform();
    this.bindAttendance();
  }

  createCategoryform() {
    this.Categoryform = this.fb.group({
      id: [0],
      shiftNameAndTime: ['', Validators.required],
      inTime: [''],
      outTime: [''],
      totalTime: [''],
    });
  }



  // update wala

  async bindAttendance() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'StaffShiftTime/GetStaffShiftList_WorkingHours'
    );

    if (res.isSuccess) {
      this.CategoryeMasterList = res.data.map((item: IShiftCategory) => ({
        ...item,
        inTime: this.datepipe.transform(item.inTime, 'HH:mm'),
        outTime: this.datepipe.transform(item.outTime, 'HH:mm'),
        totalTime: this.datepipe.transform(item.totalTime, 'HH:mm'),
      }));
    }
  }

  cancel() {
    this.createCategoryform();
    this.buttonText = 'Submit';
    this.today = new Date();
  }


  async onSubmit(form: FormGroup) {
    //
    if (!form.valid) {
      this.Category = form.value;
    }
    const date = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    const inTime = `${date}T${form.get('inTime').value}:00`;
    const outTime = `${date}T${form.get('outTime').value}:00`;
    const totalTime = `${date}T${form.get('totalTime').value}:00`;
    const formData = {
      ...form.value,
      inTime: inTime,
      outTime: outTime,
      totalTime: totalTime,
    };
    let res;
    if (this.buttonText === 'Submit') {
      res = await this.genericService.ExecuteAPI_Post<IResponse>(
        'StaffShiftTime/StaffShift_WorkingHours',
        formData
      );
    } else {
      res = await this.genericService.ExecuteAPI_Put<IResponse>(
        'StaffShiftTime/UpdateStaffShiftTime_WorkingHours',
        formData
      );
    }
    if (res.isSuccess) {
      this.toastrService.success(res.message);
      this.bindAttendance();
      this.cancel();
    } else {
      this.toastrService.error(res.message);
    }
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
          `StaffShiftTime/DeleteStaffCategory_WorkingHours?id=${id}`
        );
        if (res.isSuccess) {
          Swal.fire(
            'Deleted!',
            'Data has been deleted successfully.',
            'success'
          );
          this.bindAttendance();
        } else {
          Swal.fire('Error!', res.message, 'error');
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
      this.buttonText = 'Update';
      this.Categoryform.patchValue({
        id: this.Category.id,
        shiftNameAndTime: this.Category.shiftNameAndTime,
        inTime: this.Category.inTime,
        outTime: this.Category.outTime,
        totalTime: this.Category.totalTime,
      });
      this.contentPage.nativeElement.scrollIntoView();
    }
  }

  // calculateTotalTime() {
  //   const inTime = new Date(
  //     `1970-01-01T${this.Categoryform.get('inTime').value}:00`
  //   );
  //   const outTime = new Date(
  //     `1970-01-01T${this.Categoryform.get('outTime').value}:00`
  //   );
  //   const diff = outTime.getTime() - inTime.getTime();
  //   const hours = Math.floor(diff / (1000 * 60 * 60));
  //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //   this.Categoryform.patchValue({
  //     totalTime: `${this.padNumber(hours)}:${this.padNumber(minutes)}`,
  //   });
  // }
  // padNumber(num: number): string {
  //   return num < 10 ? `0${num}` : num.toString();
  // }


  calculateTotalTime() {
    const inTimeString = this.parseTimeTo24HourFormat(this.Categoryform.get('inTime').value);
    const outTimeString = this.parseTimeTo24HourFormat(this.Categoryform.get('outTime').value);
    const inTime = new Date(`1970-01-01T${inTimeString}:00`);
    const outTime = new Date(`1970-01-01T${outTimeString}:00`);

    if (outTime < inTime) {
      outTime.setDate(outTime.getDate() + 1);
    }

    const diff = outTime.getTime() - inTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    this.Categoryform.patchValue({
      totalTime: `${this.padNumber(hours)}:${this.padNumber(minutes)}`,
    });
  }

  parseTimeTo24HourFormat(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${this.padNumber(hours)}:${this.padNumber(minutes)}`;
  }


  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }



  pageChanged(obj: any) { }
}
