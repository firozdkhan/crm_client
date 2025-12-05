import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IAllowance } from 'src/app/interfaces/staf/allowance';
import { IStaffShift } from 'src/app/interfaces/staf/shfit';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-shfit',
  templateUrl: './staff-shfit.component.html',
  styleUrl: './staff-shfit.component.css',
})
export class StaffShfitComponent implements OnInit {
  Shiftform: FormGroup;
  ShiftMasterList: IStaffShift[] = [];
  Shift: IStaffShift;
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];

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
    private genericService: GenericService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Days',
      ColumnName: 'week',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Shift Time',
      ColumnName: 'shift',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Shift Start',
      ColumnName: 'shiftStart',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Shift End',
      ColumnName: 'shiftEnd',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Lunch Start',
      ColumnName: 'lunchStart',
      Type: 'string',
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Lunch End',
      ColumnName: 'lunchEnd',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Total Shift Time',
      ColumnName: 'totalShiftTime',
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
      DisplayText: 'Action',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });
  }

  ngOnInit(): void {
    this.createAllownaceform();
    this.bindCompanies();
    this.Shiftform.get('shiftStart')?.valueChanges.subscribe(() =>
      this.calculateTimes()
    );
    this.Shiftform.get('shiftEnd')?.valueChanges.subscribe(() =>
      this.calculateTimes()
    );
    this.Shiftform.get('lunchStart')?.valueChanges.subscribe(() =>
      this.calculateTimes()
    );
    this.Shiftform.get('lunchEnd')?.valueChanges.subscribe(() =>
      this.calculateTimes()
    );
  }

  createAllownaceform() {
    this.Shiftform = this.fb.group({
      id: [0],
      shiftStart: [''],
      shiftId: [''],
      weekId: [''],
      week: [''],
      shift: [''],
      shiftEnd: [''],
      lunchStart: [''],
      lunchEnd: [''],
      totalShiftTime: [''],
      totalLunchTime: [''],
    });
  }

  async bindCompanies() {
    try {
      let res = await this.genericService.ExecuteAPI_Get<IResponse>(
        'StaffShiftTime/GetStaffShiftListByDays'
      );
      if (res.isSuccess) {
        this.ShiftMasterList = res.data;
      }
    } catch (error) {}
  }

  cancel() {
    this.createAllownaceform();
    this.buttonText = 'Submit';
  }

  async onSubmit(form: FormGroup) {
    //
    if (form.valid) {
      try {
        let res;
        if (this.buttonText === 'Submit') {
          res = await this.genericService.ExecuteAPI_Post<IResponse>(
            'StaffShiftTime/StaffShiftTimeByDays',
            form.value
          );
          this.toastrService.success(res.message);
        } else {
          res = await this.genericService.ExecuteAPI_Put<IResponse>(
            'StaffShiftTime/UpdateStaffShiftTimeByDays',
            form.value
          );
          this.toastrService.success(res.message);
        }
        if (res.isSuccess) {
          this.bindCompanies();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      } catch (error) {}
    }
  }

  editData(company: IAllowance) {
    this.Shiftform.patchValue(company);
    this.buttonText = 'Update';
  }

  async deleteData(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.value) {
      try {
        let res = await this.genericService.ExecuteAPI_Delete<IResponse>(
          'StaffShiftTime/DeleteStaffCategoryByDays?id=' + id
        );
        if (res.isSuccess) {
          Swal.fire('Ok', 'Data has been deleted', 'success');
          this.bindCompanies();
        }
      } catch (error) {
      } finally {
        this.buttonText = 'Save';
      }
    }
  }
  actionRow(RowItem: any) {
    this.Shift = RowItem.item;
    this.action = RowItem.action;
    if (this.action === 'delete') {
      this.deleteData(this.Shift.id);
    } else {
      this.buttonText = 'Update';
      this.Shiftform.patchValue(this.Shift);
    }
  }

  calculateTimes() {
    const shiftStart = this.Shiftform.get('shiftStart')?.value;
    const shiftEnd = this.Shiftform.get('shiftEnd')?.value;
    const lunchStart = this.Shiftform.get('lunchStart')?.value;
    const lunchEnd = this.Shiftform.get('lunchEnd')?.value;

    if (shiftStart && shiftEnd) {
      const start = new Date(`1970-01-01T${shiftStart}`);
      const end = new Date(`1970-01-01T${shiftEnd}`);
      const totalShift = (end.getTime() - start.getTime()) / (1000 * 60);
      this.Shiftform.patchValue({
        totalShiftTime: this.formatTime(totalShift),
      });
    }

    if (lunchStart && lunchEnd) {
      const start = new Date(`1970-01-01T${lunchStart}`);
      const end = new Date(`1970-01-01T${lunchEnd}`);
      const totalLunch = (end.getTime() - start.getTime()) / (1000 * 60);
      this.Shiftform.patchValue({
        totalLunchTime: this.formatTime(totalLunch),
      });
    }
  }

  formatTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  }

  pageChanged(obj: any) {}
}
