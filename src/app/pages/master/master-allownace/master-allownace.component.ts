import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IAllowance } from 'src/app/interfaces/staf/allowance';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-allownace',
  templateUrl: './master-allownace.component.html',
  styleUrl: './master-allownace.component.css',
})
export class MasterAllownaceComponent implements OnInit {
  @ViewChild('goUp', { static: true }) contentPage: ElementRef;
  MasterAllownaceform: FormGroup;
  MasterAllownacelist: IAllowance[] = [];
  MasterAllownace: IAllowance;
  action: string = 'new';
  gridFilter: Array<GridFilter> = [];

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
    private genericService: GenericService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Allowance Name',
      ColumnName: 'miscAllowanceName',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Post Name',
      ColumnName: 'staffPostName',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Percent',
      ColumnName: 'inPercent',
      Type: 'string',
      Is_Sort: true,
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Lumsum',
      ColumnName: 'approximateAmount',
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
    this.createCategoryform();
    this.bindAttendance();
  }

  createCategoryform() {
    this.MasterAllownaceform = this.fb.group({
      id: [0],
      miscAllowanceId: ['', Validators.required],
      postId: ['', Validators.required],
      inPercent: ['', Validators.required],
      approximateAmount: [0],
    });
  }

  async bindAttendance() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'MasterAllowance/GetAllMasterAllowance'
    );
    if (res.isSuccess) {
      this.MasterAllownacelist = res.data;
    }
  }

  cancel() {
    this.createCategoryform();
    this.buttonText = 'Submit';
  }

  async onSubmit(form: FormGroup) {
    //
    if (!form.valid) {
      this.MasterAllownace = form.value;
    }
    const formData = { ...form.value };
    let res;
    if (this.buttonText === 'Submit') {
      res = await this.genericService.ExecuteAPI_Post<IResponse>(
        'MasterAllowance/AddMasterAllowance',
        formData
      );
    } else {
      res = await this.genericService.ExecuteAPI_Put<IResponse>(
        'MasterAllowance/UpdateMasterAllowance',
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
          `MasterAllowance/DeleteMasterAllowance?id=${id}`
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
    this.MasterAllownace = RowItem.item;
    this.action = RowItem.action;
    if (this.action === 'delete') {
      this.deleteData(this.MasterAllownace.id);
    } else {
      this.buttonText = 'Update';
      this.MasterAllownaceform.patchValue(this.MasterAllownace);
    }
    this.contentPage.nativeElement.scrollIntoView();
  }

  pageChanged(obj: any) { }
}
