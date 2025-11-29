import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { IUserProfile } from 'src/app/user/interfaces/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private genericService: GenericService
  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: "User Id", ColumnName: "srNo", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Passsword", ColumnName: "password", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Name", ColumnName: "name", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Father Name", ColumnName: "fatherName", Type: "string", Is_Visible: true, Is_Sort: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Photo", ColumnName: "photoUrl", Type: "image", Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Active", ColumnName: "active", Type: "boolean", Is_Visible: true });
  }


  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete' },
  ];


  users: IUserProfile[];
  rolesHeading: IUserProfile[];
  selectedUsers: IUserProfile[];
  user: IUserProfile;
  txtSearch = "";
  userCounts: number;
  totalStudent: number;
  action: string = "new";
  userForm: FormGroup;

  ngOnInit(): void {

    this.bindData();
  }

  async bindData() {
    let params = new HttpParams().set("userType", "Student")
    let studentResponse = await this.genericService.ExecuteAPI_Get<IResponse>("Core/getUserListWeb", params);
    if (studentResponse.isSuccess) {
      this.users = studentResponse.data;
      this.rolesHeading = [...new Map(this.users.map(item =>
        [item["roleName"], item])).values()];
      this.selectedUsers = this.users.filter(x => x.roleName == this.rolesHeading[0].roleName);
      console.log(this.selectedUsers);
      this.userCounts = this.selectedUsers.length;

    }




  }
  onRoleChange(role: string) {
    this.selectedUsers = this.users.filter(x => x.roleName == role);
    this.userCounts = this.selectedUsers.length;
  }



  async actionRow(rowItem: any) {
    this.user = rowItem.item;
    this.user.active = !this.user.active;
    let user = await this.genericService.ExecuteAPI_Put<IResponse>("Users/ActiveOrDeactiveUser", this.user);
    if (user) {
      this.toaster.success('Success', 'User status has been changed');
    }
  }
  pageChanged(obj: any) { }

}
