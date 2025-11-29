import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { ICreateUser, IRoles, IUser } from 'src/app/user/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private service: SystemService,
    private genericService: GenericService
  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: "User Name", ColumnName: "name", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "User Id", ColumnName: "userName", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Password", ColumnName: "password", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "User Type", ColumnName: "userType", Type: "number", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Email", ColumnName: "email", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
  }

  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete' },
  ];
  roleForm: FormGroup;
  users: ICreateUser[] = [];
  user: ICreateUser;
  roles: ICommonValue[];
  userType: string = '';
  txtSearch = "";
  totalRecords: number;
  action: string = "new";
  buttonText: string = "Submit";
  passwordVisible: boolean = false;

  ngOnInit(): void {
    this.createRoleForm();
    this.getAllUsers();
    this.getRoles();
    console.log(this.roleForm);
  }

  async getAllUsers() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Core/GetAllUser");
    if (res.isSuccess) {
      this.users = res.data;
      this.totalRecords = res.length;
    }
  }
  async getRoles() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Core/getRoles");
    if (res.isSuccess) {
      this.roles = res.data.map(x => <ICommonValue>{
        id: x.id,
        name: x.name
      });

    }
  }

  getUserType(event: number) {
    let type = this.roles.filter(x => x.id == event.toString());
    this.userType = type[0].name;

    console.log(this.userType);
  }

  createRoleForm() {
    this.roleForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      name: ['', Validators.required],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ],
      ],
      userTypeId: [null, Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required]
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
    } else {
      this.saveRoles();
    }

    this.action = "new";
    this.buttonText = "Submit";
  }

  pageChanged(obj: any) { }

  async editRoles() {
    this.user = this.roleForm.value;
    this.user.userType = this.userType;
    let res = await this.genericService.ExecuteAPI_Put<IResponse>("Core/UpdateUser", this.user);
    if (res.isSuccess) {
      this.getAllUsers();
      this.toastrService.success('Success', 'User updated successfully');
      this.cancel();
    }
  }

  async saveRoles() {
    this.user = this.roleForm.value;
    this.user.userType = this.userType;
    let res = await this.genericService.ExecuteAPI_Post<IResponse>("Core/SaveUser", this.user);
    if (res) {
      this.getAllUsers();
      this.createRoleForm();
      this.cancel();
      this.toastrService.success('Success', 'User saved successfully');
      this.service.App.refreshGrid.emit();
    }
  }

  async deleteMenu(id: any) {
    const result = await Swal.fire({
      title: 'Are you sure you want to remove?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      let params = new HttpParams().set('roleId', id.toString());
      let res = await this.genericService.ExecuteAPI_Delete<IResponse>("Core/DeleteUser?id=" + id, params);
      if (res.isSuccess) {
        this.getAllUsers();
        this.cancel();
        Swal.fire(
          'Deleted!',
          'Your user has been deleted.',
          'success'
        );
        this.service.App.refreshGrid.emit();
      }
    }
  }

  actionRow(RowItem: any) {
    this.user = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteMenu(this.user.id);
    } else if (this.action === "edit") {
      this.roleForm.patchValue(this.user);
      this.buttonText = "Update";
    }
  }


}
