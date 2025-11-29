import { ToastrService } from 'ngx-toastr';

import { Component, NgZone, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  GridFilter,
  Action_Type,
} from 'src/app/shared/controls/grid/common_model';
import {
  IMenuData,
  IMenuList,
} from 'src/app/interfaces/settings/menu-interface';
import { IResponse } from 'src/app/interfaces/response';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
})
export class AddMenuComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private genericService: GenericService,
    private trans: TranslatePipe
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Menu Name',
      ColumnName: 'nameWithParent',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Page Url',
      ColumnName: 'pageUrl',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Serial No',
      ColumnName: 'iSerialNo',
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
  }

  txtSearch = '';
  totalRecords: number;
  action: string = 'new';
  buttonText: string = 'Submit';

  menuData: IMenuData;
  menu: IMenuList;

  menuList: Array<IMenuList> = [];
  menuDropdown: ICommonValue[];
  errors: string[];
  menuForm: FormGroup;
  parentMenuID: number;

  ngOnInit(): void {
    this.getMenuData();
    this.CreateMenuForm();
  }

  async getMenuData() {
    let data = await this.genericService.ExecuteAPI_Get<IResponse>(
      'core/getMenuData'
    );
    if (data) {
      this.menuList = data.data.menuList;
      this.menuDropdown = data.data.menuDropdown.map(
        (x) =>
          <ICommonValue>{
            id: x.id.toString(),
            name: x.name,
          }
      );
    }
  }

  cancel(): void {
    this.CreateMenuForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  CreateMenuForm() {
    this.menuForm = this.fb.group({
      id: [
        0,
        [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      menuName: ['', Validators.required],
      iSerialNo: ['', Validators.required],
      fabIcon: ['', Validators.nullValidator],
      parentMenuID: [null],
      pageUrl: ['', Validators.nullValidator],
      menuFor: ['website', Validators.nullValidator],
    });
  }

  onSubmit(): void {
    if (this.action === 'edit') {
      this.editMenu();
    } else {
      this.saveMenu();
    }

    this.action = 'new';
    this.buttonText = 'Submit';
  }
  pageChanged(obj: any) {}

  async editMenu() {
    let res = await this.genericService.ExecuteAPI_Post<IResponse>(
      'Core/UpdateMenu',
      this.menuForm.value
    );
    if (res.isSuccess) {
      this.getMenuData();
      this.toastrService.success(res.message);
      this.cancel();
    }
  }

  async saveMenu() {
    let res = await this.genericService.ExecuteAPI_Post<IResponse>(
      'Core/SaveMenu',
      this.menuForm.value
    );
    if (res.isSuccess) {
      this.ngZone.run(() => {
        this.getMenuData();
        this.toastrService.success(res.message);
        this.cancel();
      });
    }
  }

  deleteMenu(menu: IMenuList) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ngZone.run(
          async () => {
            let res = await this.genericService.ExecuteAPI_Post<IResponse>(
              'Core/DeleteMenu',
              menu
            );
            if (res.isSuccess) {
              this.getMenuData();
              this.cancel();
              Swal.fire(
                this.trans.transform('Deleted!'),
                this.trans.transform(res.message),
                'success'
              );
            }
          },
          (error) => {
            console.log(error);
            this.errors = error.errors;
          }
        );
      }
    });
  }

  actionRow(RowItem: any) {
    this.menu = RowItem.item;

    this.action = RowItem.action;
    if (this.action === 'delete') {
      this.deleteMenu(this.menu);
    } else {
      this.buttonText = 'Update';
      if (this.menu.parentMenuID) {
        this.menu.parentMenuID = this.menu.parentMenuID.toString();
      }

      this.menuForm.patchValue(this.menu);
      this.parentMenuID = this.menu.parentMenuID;
    }
  }
}
