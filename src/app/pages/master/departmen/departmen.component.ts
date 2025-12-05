import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { Icompany } from 'src/app/interfaces/master/company-master';
import { IDepartment } from 'src/app/interfaces/master/department';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departmen',
  templateUrl: './departmen.component.html',
  styleUrl: './departmen.component.css'
})
export class DepartmenComponent implements OnInit {
  departmentMasterForm: FormGroup;
  DepartmentMasterList: IDepartment[] = [];
  Department: IDepartment
  action: string = "new";
  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, tooltip: "Edit", font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, tooltip: "Delete", font: 'fal fa-trash-alt', type: 'delete' },
  ];
  buttonText: string = 'Submit';

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private genericService: GenericService
  ) {

    // this.gridFilter.push(<GridFilter>{ DisplayText: 'Company Name', ColumnName: 'companyName', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Company Id', ColumnName: 'companyId', Type: 'number', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Department Name', ColumnName: 'departmentName', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true });
  }

  ngOnInit(): void {
    this.createCompanyMasterForm();
    this.binddepartment();
  }

  createCompanyMasterForm() {
    this.departmentMasterForm = this.fb.group({
      id: [0],
      // companyName: ['', Validators.required],
      companyId: ['', Validators.required],
      departmentName: ['', Validators.required],

    });
  }

  async binddepartment() {
    try {
      let res = await this.genericService.ExecuteAPI_Get<IResponse>('Masters/GetDepartmentByName');
      if (res.isSuccess) {
        this.DepartmentMasterList = res.data;
      }
    } catch (error) {

    }
  }

  cancel() {
    this.createCompanyMasterForm();
    this.buttonText = 'Submit';
  }

  async onSubmit(form: FormGroup) {
    if (form.valid) {
      try {
        let res;
        if (this.buttonText === 'Submit') {
          res = await this.genericService.ExecuteAPI_Post<IResponse>('Masters/AddNewDepartment', form.value);
          this.toastrService.success('Company added successfully!');
        } else {
          res = await this.genericService.ExecuteAPI_Put<IResponse>('Masters/UpdateDepartment', form.value);
          this.toastrService.success('Company updated successfully!');
        }

        if (res.isSuccess) {
          this.binddepartment();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      } catch (error) {

      }
    }
  }

  editData(company: IDepartment) {
    this.departmentMasterForm.patchValue(company);
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
        let res = await this.genericService.ExecuteAPI_Delete<IResponse>(`Masters/DeleteDepatment?id=${id}`);
        if (res.isSuccess) {
          Swal.fire('Deleted!', 'Company has been deleted.', 'success');
          this.binddepartment();
        }
      } catch (error) {

      }
    }
  }

  actionRow(RowItem: any) {

    this.Department = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteData(this.Department.id);
    }
    else {
      this.buttonText = "Update";
      this.departmentMasterForm.patchValue(this.Department);

    }
  }
  pageChanged(obj: any) { }
}
