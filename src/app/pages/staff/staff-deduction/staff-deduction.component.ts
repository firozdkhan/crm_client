import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IDeduction } from 'src/app/interfaces/staf/deduction';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-deduction',
  templateUrl: './staff-deduction.component.html',
  styleUrl: './staff-deduction.component.css'
})
export class StaffDeductionComponent implements OnInit {
  Deductionform: FormGroup;
  DeductionMasterList: IDeduction[] = [];
  Deduction: IDeduction
  action: string = "new";
  gridFilter: Array<GridFilter> = [];

  actions: Action_Type[] = [
    // { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, tooltip: "Delete", font: 'fal fa-trash-alt', type: 'delete' },
  ];
  buttonText: string = 'Submit';

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private genericService: GenericService,
    private trans: TranslatePipe
  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: 'Staff Name', ColumnName: 'staffName', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Deduction', ColumnName: 'miscDeductionName', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Percentage', ColumnName: 'inPercent', Type: 'number', Is_Sort: true, Is_Price: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Deduction Amount', ColumnName: 'approximateAmount', Type: 'number', Is_Sort: true, Is_Visible: true, Is_Price: true, Is_Sum: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true });
  }

  ngOnInit(): void {
    this.createAllownaceform();
    this.bindCompanies();

  }

  createAllownaceform() {
    this.Deductionform = this.fb.group({
      id: [0],
      staffId: ['', Validators.required],
      staff: [''],
      deductionId: ['', Validators.required],
      deduction: [''],
      percentage: [''],
      lumSum: [''],
      deductionAmount: ['']
    });
  }

  async bindCompanies() {
    try {
      let res = await this.genericService.ExecuteAPI_Get<IResponse>('StaffDeduction/GetAllStaffDeduction');
      if (res.isSuccess) {
        this.DeductionMasterList = res.data;
      }
    } catch (error) {

    }
  }

  cancel() {
    this.createAllownaceform();
    this.buttonText = 'Submit';
  }

  async onSubmit(form: FormGroup) {

    if (form.valid) {
      try {
        let res;
        if (this.buttonText === 'Submit') {
          res = await this.genericService.ExecuteAPI_Post<IResponse>('StaffDeduction/AddStaffdeduction', form.value);
          this.toastrService.success(res.message);
        } else {
          res = await this.genericService.ExecuteAPI_Put<IResponse>('StaffDeduction/UpdateStaffDeduction', form.value);
          this.toastrService.success(res.message);
        }
        if (res.isSuccess) {
          this.bindCompanies();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      } catch (error) {

      }
    }
  }

  editData(company: IDeduction) {

    this.Deductionform.patchValue(company);
    this.buttonText = 'Update';
  }

  deleteData(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let parames = new HttpParams().set("id", id);
        let expensees = await this.genericService.ExecuteAPI_Delete<IResponse>("StaffDeduction/DeleteStaffDeduction", parames);
        if (expensees) {
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your imaginary file has been deleted.'),
            'success'
          );
          this.DeductionMasterList = this.DeductionMasterList.filter(x => x.id != id);
        }
      }
    });
  }
  actionRow(RowItem: any) {
    console.log("Action row data:", RowItem);
    this.Deduction = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteData(this.Deduction.id);
    }
    else {
      this.buttonText = "Update";
      this.Deductionform.patchValue(this.Deduction);

    }
  }
  pageChanged(obj: any) { }
}
