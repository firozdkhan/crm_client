import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IChangePassword } from 'src/app/interfaces/settings/change-password';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { IToastyMessage } from 'src/app/shared/interfaces/toasty-message';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PasswordStrengthValidator } from '../../models/password-strenght';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private toastrService: ToastrService,
    private genericService: GenericService,
    private userService: StoredDataService,

  ) {

  }

  user$: any;
  txtSearch: string;
  totalRecords: number;
  changePasswords: IChangePassword[] = [];
  changePassword: IChangePassword;
  action: string = "new";
  buttonText: string = "Submit";
  changePasswordForm: FormGroup;
  isOldPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isConfirmNewPasswordVisible: boolean = false;

  ngOnInit(): void {

    this.createChnagePasswordForm();
  }




  createChnagePasswordForm() {

    const validatePasswordMatch = (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.changePasswordForm?.get('newPassword')?.value as string;
      const passwordConfirm = control.value as string;
      if (password !== passwordConfirm) {
        return { passwordMatch: true };
      }

      return null;
    };


    this.changePasswordForm = this.fb.group({

      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, PasswordStrengthValidator]],
      confirmNewPassword: [null, [Validators.required, validatePasswordMatch]],

    });
  }

  cancel(): void {
    this.createChnagePasswordForm();
  }

  onSubmit(): void {

    this.changedPassword();

    this.action = "new";
    this.buttonText = "Submit";
  }

  pageChanged(obj: any) { }


  async changedPassword() {

    this.changePassword = this.changePasswordForm.value;

    let res = await this.genericService.ExecuteAPI_Post<IToastyMessage>("Users/ChangePassword", this.changePassword);
    if (res.isSuccess) {
      this.ngZone.run(() => {
        this.ngOnInit();
        this.cancel();
        this.toastrService.success('Success', 'Password change successfully');

        this.userService.loadCurrentUser();
        location.href = '/dashboard';

      });
    } else {
      this.toastrService.error('Opps', res.message);
    }
  }



  actionRow(RowItem: any) {
    this.changePassword = RowItem.item;
    this.action = RowItem.action;

  }


  toggleVisibility(field: string) {
    if (field === 'oldPassword') {
      this.isOldPasswordVisible = !this.isOldPasswordVisible;
    } else if (field === 'newPassword') {
      this.isNewPasswordVisible = !this.isNewPasswordVisible;
    } else if (field === 'confirmNewPassword') {
      this.isConfirmNewPasswordVisible = !this.isConfirmNewPasswordVisible;
    }
  }

}

