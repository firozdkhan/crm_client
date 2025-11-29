import { HttpParams } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { IMenuList, IMenuData } from 'src/app/interfaces/settings/menu-interface';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { ITreeViewItem } from 'src/app/shared/interfaces/treeviewItems';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { IRoles } from 'src/app/user/interfaces/user';
import Swal from 'sweetalert2';
import { NodeItem } from 'tree-ngx';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private service: SystemService,
    private modalService: NgbModal,
    private genericService: GenericService

  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: "Roles", ColumnName: "name", Type: "string", Is_Visible: true, Is_Sort: true });
    // this.gridFilter.push(<GridFilter>{ DisplayText: "Default Page", ColumnName: "indexPage", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Total Users", ColumnName: "totalUser", Type: "number", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
  }

  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit' },
    // { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete' },
  ];
  roleForm: FormGroup;
  roles: IRoles[] = [];
  role: IRoles;
  menuList: Array<IMenuList> = [];
  permissions: number[];
  public firstTree: NodeItem<string>[] = [];
  menuItems: NodeItem<string>[] = [];
  txtSearch = "";
  totalRecords: number;
  action: string = "new";
  buttonText: string = "Submit";
  errors: string[];
  defaultPage : ICommonValue[] = [];


  ngOnInit(): void {
    this.getMenuList();
    this.createRoleForm();
    this.getRoles();
    this.getMenus();

  }

  async getRoles() {
     
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Core/getRoles");
    if (res.isSuccess) {
      this.roles = res.data;
      this.totalRecords = res.length;
    }
  }
  async getMenuList()
  {

      let res = await this.genericService.ExecuteAPI_Get<IResponse>("core/getMenuDataForDropDown");
          if (res.isSuccess) {
            this.defaultPage = res.data;

          }
  }

  createRoleForm() {

    this.roleForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      name: ['', Validators.required],
      indexPage: ['', Validators.required]
    });
  }

  cancel(): void {
    this.service.App.refreshGrid.emit();
    this.createRoleForm();
    this.action = "new";
    this.buttonText = "Submit";
  }

  onSubmit(): void {
    if (this.action === "edit") {
      this.editRoles();
    }
    else {
      this.saveRoles();
    }

    this.action = "new";
    this.buttonText = "Submit";
  }

  pageChanged(obj: any) { }

  async editRoles() {
    this.role = this.roleForm.value;
    this.role.permissions = this.permissions;
    let res = await this.genericService.ExecuteAPI_Put<IResponse>("Core/updateRole", this.role);
    if (res.isSuccess) {
      this.toastrService.success(res.message);
      this.getRoles();
      this.cancel();
    }
    else{
      this.toastrService.error(res.message);
    }
  }

  async saveRoles() {
    this.role = this.roleForm.value;
    this.role.permissions = this.permissions;
    let res = await this.genericService.ExecuteAPI_Post<IResponse>("Core/saveRole", this.role);
    if (res.isSuccess) {
      this.ngZone.run(() => {
        this.getRoles();
        this.getMenus();
        this.createRoleForm();
        this.cancel();
        this.toastrService.success(res.message);
        this.service.App.refreshGrid.emit();
      });
    }
  }



  async deleteMenu(id: any) {
    const result = await Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });
    let params = new HttpParams().set('roleId', id.toString());
    let res = await this.genericService.ExecuteAPI_Delete<IResponse>("Core/deleteRole", params);
    if (res.isSuccess) {
      this.ngZone.run(() => {
        this.getRoles();
        this.getMenus();
        this.cancel();
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
        this.service.App.refreshGrid.emit();
      });
    }

  }
  actionRow(RowItem: any) {
    this.role = RowItem.item;
    this.role.permissions = this.permissions;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteMenu(this.role.id);
    }
    else {
      this.getMenus(this.role.id);
      this.buttonText = "Update";
      this.roleForm.patchValue(this.role);
    }
  }

  open(content) {
    this.modalService.open(content);
  }

  onSelectedChange(event: any): void {

    let permissions: string[] = event.selectedPermissions as string[]
    let names = this.menuList.filter(s => permissions.includes(s.menuName));
    let parentMenuID: number[] = [...new Set(names.filter(x => x.parentMenuID != null).map(x => { return x.parentMenuID }))];
    let result: number[] = names.map(x => { return x.id })
    // result = [...result, ...parentMenuID]
    this.permissions = result;

  }

  async getMenus(roleId: any = 1) {
 
    let params = new HttpParams().set("roleId", roleId)
    let res = await this.genericService.ExecuteAPI_Get<ITreeViewItem[]>('Core/getMenuTree', params);
    if (res.isSuccess) {
      this.menuItems = res.data;
      
 
    }
    else{
      this.toastrService.error(res.message)
    }

    let data = await this.genericService.ExecuteAPI_Get<IMenuData>("Core/getMenuData", params);
    if (data.isSuccess) {
      this.menuList = data.data.menuList;

    }
    else{
      this.toastrService.error(res.message)
    }
  }



}
