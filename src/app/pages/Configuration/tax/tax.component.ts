import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITax } from 'src/app/interfaces/configuration/tax';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.css',
})
export class TaxComponent {
  taxs: ITax[] = [];
  tax: ITax;
  parentMenu: ICommonValue[];
  taxForm: FormGroup;
  parentId: number;
  buttonText: string = 'Submit';
  action: string = 'new';

  categories: any[];
  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Tax Name',
      ColumnName: 'taxName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Tax Rate (%)',
      ColumnName: 'taxRate',
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

  ngOnInit() {
    this.createTaxForm();
    this.gettabledata();
  }

  createTaxForm() {
    this.taxForm = this.fb.group({
      id: [0],
      taxId: [null, Validators.required],
      taxRate: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });
  }

  async gettabledata() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'TaxApi/GetTaxData'
    );
    if (res.data) {
      this.taxs = res.data;
      console.log(this.taxs);
    }
  }

  async onSubmit() {
    if (this.taxForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const taxData: ITax = this.taxForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'TaxApi/AddNewTax',
        taxData
      );

      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.gettabledata();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
    if (this.taxForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const taxData: ITax = this.taxForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'TaxApi/UpdateTax',
      taxData
    );

    if (res.isSuccess) {
      this.toastr.success('Category updated successfully');
      await this.gettabledata();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
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
          this.taxs = this.taxs.filter((category) => category.id !== miscId);
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

  actionRow(RowItem: any) {
    this.tax = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.tax.id);
    } else {
      this.buttonText = 'Update';
      this.taxForm.patchValue(this.tax);
      this.parentId = this.tax.taxId;
    }
  }

  public changed(e: any): void {
    let item1 = this.parentMenu.find((i) => i.id === e);
    console.log(item1);

    if (e != '') {
      this.systemService.App.searchFilter.emit(item1.name);
    }
  }

  cancel(): void {
    this.createTaxForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  pageChanged(obj: any) {}
}
