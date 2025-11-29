import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IUnitMesurement } from 'src/app/interfaces/inventory/unit';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unitmesuement',
  templateUrl: './unitmesuement.component.html',
  styleUrl: './unitmesuement.component.css',
})
export class UnitmesuementComponent {
  units: IUnitMesurement[] = [];
  unit: IUnitMesurement;
  parentMenu: ICommonValue[];
  unitForm: FormGroup;
  parentId: number;
  buttonText: string = 'Submit';
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

  categories: any[];

  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Unit Name',
      ColumnName: 'unitName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Decimal Places',
      ColumnName: 'decimalPlace',
      Type: 'number',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Edit',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });

    this.categories = [];
  }

  //Load
  ngOnInit(): void {
    this.GetUnitData();
    this.CreateUnitForm();
  }

  //Form Create
  CreateUnitForm() {
    this.unitForm = this.fb.group({
      id: [0],
      unitId: [null, Validators.required],
      decimalPlace: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });
  }

  //GetData
  async GetUnitData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'UnitApi/GetAllUnit'
    );
    if (res.data) {
      this.units = res.data;
    }
  }

  actionRow(RowItem: any) {
    this.unit = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.unit.id);
    } else {
      this.buttonText = 'Update';
      this.unitForm.patchValue(this.unit);
      this.parentId = this.unit.unitId;
    }
  }

  async deleteMenu(miscId: number) {
     
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set('id', miscId.toString());
        let res = await this.genericSErvice.ExecuteAPI_Delete(
          'TaxApi/DeleteTax',
          params
        );
        if (res && res) {
          this.units = this.units.filter((category) => category.id !== miscId);
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your record has been deleted.'),
            'success'
          );
        } else {
          this.toastr.error('Failed to delete record');
        }
      }
    });
  }

  public changed(e: any): void {
    let item1 = this.parentMenu.find((i) => i.id === e);
    console.log(item1);

    if (e != '') {
      this.systemService.App.searchFilter.emit(item1.name);
    }
  }
  pageChanged(obj: any) {}

  //Common Function end

  async onSubmit() {
    if (this.unitForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const UnitData: IUnitMesurement = this.unitForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'UnitApi/AddNewUnit',
        UnitData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetUnitData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.unitForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const taxData: IUnitMesurement = this.unitForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'UnitApi/UpdateUnit',
      taxData
    );

    if (res.isSuccess) {
      this.toastr.success('Category updated successfully');
      await this.GetUnitData();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  cancel() {
    this.CreateUnitForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }
}
