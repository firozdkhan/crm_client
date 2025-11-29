import { async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from './../../interfaces/user';


import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, ReplaySubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: StoredDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService) { }
  singinForm: FormGroup;
  returnUrl: string;
  user$: Observable<IUser>;
  isOldPasswordVisible: boolean = false;

  ngOnInit(): void {

    const token = localStorage.getItem('smart_token');
    let tokenValidity = this.jwtHelper.isTokenExpired(token);

    if (token != null && tokenValidity == false) {

      this.router.navigate(["/dashboard"]);
      return;
    }


    this.createForm();
  }

  getthis() {

  }


  createForm() {
    this.singinForm = new FormGroup({
      userId: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      remember: new FormControl(false)
    });
  }

  onSubmit() {

    if (!this.singinForm.valid) {
      return;
    }

    this.userService.Loginuser(this.singinForm.value);

  }

  toggleVisibility(field: string) {
    if (field === 'oldPassword') {
      this.isOldPasswordVisible = !this.isOldPasswordVisible;
    }
  }

}
