import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IHoliday } from 'src/app/interfaces/master/holiday';
import { IResponse } from 'src/app/interfaces/response';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.css',
})
export class HolidayComponent {
  holiday: IHoliday;
  holidays: IHoliday[] = [];

  today = new Date();
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];
  buttonText: string = 'Show';
  apiUrl = environment.apiUrl;
  startDate: Date;
  endDate: Date;
  changeDateformat: any;
  holidayForm: FormGroup;
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, tooltip: "Edit", font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, tooltip: "Delete", font: 'fal fa-trash-alt', type: 'delete' },
  ];

  constructor(
    private toastr: ToastrService,private generic: GenericService,private fb: FormBuilder,private datepipe: DatePipe,private trans: TranslatePipe) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Holiday Name',ColumnName: 'holidayName',Type: 'string',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'From',ColumnName: 'fromDate',Type: 'date',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'To',ColumnName: 'toDate',Type: 'date',Is_Sort: true,Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true });

    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  ngOnInit(): void {
    this.CreateHolidayForm();
    this.GetHoliday();
  }

  CreateHolidayForm() {
    this.holidayForm = this.fb.group({
      id: [0],
      holidayName: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
    });
  }

  cancel() {
    this.CreateHolidayForm();
    this.today = new Date();
  }

  async GetHoliday() {
    let res = await this.generic.ExecuteAPI_Get<IResponse>(
      'StaffHoliday/GetListHoliday'
    );

    if (res) {
      this.holidays = res.data;
    }
  }

  async onSubmit() {
    if (this.holidayForm.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    let fromDate = new Date(this.holidayForm.value.fromDate);
    let toDate = new Date(this.holidayForm.value.toDate);

    // ✅ check ulta na ho
    if (fromDate > toDate) {
      this.toastr.error('From Date cannot be greater than To Date');
      return;
    }
  let  changeDate = new ChangeDatePipe(this.datepipe);

    const payload: IHoliday = {
      id: this.holidayForm.value.id,
      holidayName: this.holidayForm.value.holidayName,
      fromDate: changeDate.transform(this.holidayForm.value.fromDate) ,
      toDate: changeDate.transform(this.holidayForm.value.toDate),
    };

    let res: IResponse;

    if (payload.id && payload.id > 0) {
      res = await this.generic.ExecuteAPI_Put<IResponse>(
        'StaffHoliday/UpdateHoliday',
        payload
      );
    } else {
      res = await this.generic.ExecuteAPI_Post<IResponse>(
        'StaffHoliday/AddHoliday',
        payload
      );
    }

    if (res && res.isSuccess) {
      this.toastr.success(res.message || 'Saved successfully!');
      this.GetHoliday();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Something went wrong');
    }
  }



  editData(company: IHoliday) {

    this.holidayForm.patchValue(company);
    this.buttonText = 'Update';
  }

  async deleteData(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        let res = await this.generic.ExecuteAPI_Delete<IResponse>(`StaffHoliday/DeleteHoliday?id=${id}`);
        if (res.isSuccess) {
          Swal.fire('Deleted!', 'Holiday has been deleted.', 'success');
          this.GetHoliday();
        }
      } catch (error) {

      }
    }
  }
  disable: boolean = false;

  actionRow(RowItem: any) {

    this.holiday = RowItem.item;
    this.holiday.fromDate = this.datepipe.transform(this.holiday.fromDate,'dd MMM YYYY');
    this.holiday.toDate = this.datepipe.transform(this.holiday.toDate ,'dd MMM YYYY');
    this.action = RowItem.action;


    if (this.action === "delete") {
      this.deleteData(this.holiday.id);
    }
    else {
      this.disable = true;
      this.buttonText = "Update";
      this.holidayForm.patchValue(this.holiday);
      // this.contentPage.nativeElement.scrollIntoView();
    }
  }
  pageChanged(obj: any) { }
}
