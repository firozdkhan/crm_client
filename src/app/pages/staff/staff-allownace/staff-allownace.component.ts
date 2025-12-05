import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IAllowance } from 'src/app/interfaces/staf/allowance';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-allownace',
  templateUrl: './staff-allownace.component.html',
  styleUrl: './staff-allownace.component.css'
})
export class StaffAllownaceComponent implements OnInit {
  Allownaceform: FormGroup;
  AllownaceMasterList: IAllowance[] = [];
  Allownace: IAllowance
  action: string = "new";
  gridFilter: Array<GridFilter> = [];

  actions: Action_Type[] = [

    { class: 'btn-outline-danger', tooltip: "Delete", text: null, font: 'fal fa-trash-alt', type: 'delete' },
  ];
  buttonText: string = 'Submit';

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private genericService: GenericService,
    private trans: TranslatePipe
  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: 'Staff Name', ColumnName: 'staffName', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Allowance', ColumnName: 'miscAllowanceName', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Percentage', ColumnName: 'inPercent', Type: 'number', Is_Sort: true, Is_Price: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Amount', ColumnName: 'approximateAmount', Type: 'number', Is_Sort: true, Is_Visible: true, Is_Price: true, Is_Sum: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true });
  }

  ngOnInit(): void {
    this.createAllownaceform();
    this.bindCompanies();

  }

  createAllownaceform() {
    this.Allownaceform = this.fb.group({
      id: [0],
      staffId: ['', Validators.required],
      staff: [''],
      miscAllowanceId: ['', Validators.required],
      allowance: [''],
      inPercent: [''],
      approximateAmount: ['']
    });
  }

  async bindCompanies() {
    try {
      let res = await this.genericService.ExecuteAPI_Get<IResponse>('StaffAllowance/GetAllStaffAllowance');
      if (res.isSuccess) {
        this.AllownaceMasterList = res.data;
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
          res = await this.genericService.ExecuteAPI_Post<IResponse>('StaffAllowance/AddStaffAllowanc', form.value);
          this.toastrService.success(res.message);
        } else {
          res = await this.genericService.ExecuteAPI_Put<IResponse>('StaffAllowance/UpdateStaffAllowance', form.value);
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

  editData(company: IAllowance) {

    this.Allownaceform.patchValue(company);
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
        let res = await this.genericService.ExecuteAPI_Delete<IResponse>(`StaffAllowance/DeleteStaffAllowance?id=${id}`);
        if (res.isSuccess) {
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your imaginary file has been deleted.'),
            'success'
          );
          this.bindCompanies();
        }
      } catch (error) {

      }
    }
  }

  actionRow(RowItem: any) {

    this.Allownace = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteData(this.Allownace.id);
    }
    else {

      this.buttonText = "Update";
      this.Allownaceform.patchValue(this.Allownace);

    }
  }
  pageChanged(obj: any) { }
}
