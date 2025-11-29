import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IOTP } from 'src/app/interfaces/user/otp';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { IToastyMessage } from 'src/app/shared/interfaces/toasty-message';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PasswordStrengthValidator } from '../../models/password-strenght';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private toastrService: ToastrService,
    private sharedService: SharedService,
    private genericService: GenericService,
    private router: Router,
    private userService: StoredDataService,
    private route: ActivatedRoute
  ) { }

  user$: any;
  txtSearch: string;
  totalRecords: number;
  otp: IOTP;
  isConfirmNewPasswordVisible: boolean = false;
  PasswordVisible: boolean = false;
  ConfirmPasswordVisible: boolean = false;
  action: string = "new";
  buttonText: string = "Submit";
  changePasswordForm: FormGroup;
  id: number;
  refId: string;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.id = params.id;
        this.refId = params.refId;
      }
    })
    this.createChangePasswordForm();
  }

  createChangePasswordForm() {
    const validatePasswordMatch = (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.changePasswordForm?.get('password')?.value as string;
      const passwordConfirm = control.value as string;
      if (password !== passwordConfirm) {
        return { passwordMatch: true };
      }
      return null;
    };

    this.changePasswordForm = this.fb.group({
      id: [this.id, [Validators.required]],
      refId: [this.refId, [Validators.required]],
      otpCode: [null, [Validators.required]],
      password: [null, [Validators.required, PasswordStrengthValidator]],
      confirmNewPassword: [null, [Validators.required, validatePasswordMatch]],
    });
  }

  cancel(): void {
    this.createChangePasswordForm();
  }

  onSubmit(): void {
    this.changedPassword();
    this.action = "new";
    this.buttonText = "Submit";
  }

  async changedPassword() {
    this.otp = this.changePasswordForm.value;
    let res = await this.genericService.ExecuteAPI_Post<IToastyMessage>("Users/ResetPassword", this.otp);
    if (res.isSuccess) {
      this.ngZone.run(() => {
        this.toastrService.success('Success', 'Password reset successfully');
        this.cancel();
        this.router.navigate(['/user/login']);
      });
    } else {
      this.toastrService.error('Oops', res.message);
    }
  }

  togglePasswordVisibility() {
    this.PasswordVisible = !this.PasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.ConfirmPasswordVisible = !this.ConfirmPasswordVisible;
  }
}
