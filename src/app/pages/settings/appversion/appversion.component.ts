import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IAppVersion } from 'src/app/interfaces/settings/appversion';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';

@Component({
  selector: 'app-appversion',
  templateUrl: './appversion.component.html',
  styleUrl: './appversion.component.css'
})
export class AppversionComponent {

  appversionform: FormGroup
  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private toastrService: ToastrService,
    private genericService: GenericService,
    private userService: StoredDataService,

  ) {

  }


  appversion: IAppVersion;


  ngOnInit(): void {

    this.createChnagePasswordForm();
    this.GetCurrentVerion();
  }




  createChnagePasswordForm() {
    this.appversionform = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],],
      versionType: ['', Validators.required],

    });



  }

  cancel(): void {
    this.createChnagePasswordForm();
  }

onSubmit(): void {
  if (this.appversionform.valid) {
    this.appversion = this.appversionform.value;

    this.genericService.ExecuteAPI_Put<IResponse>(
      'Dashboard/UpdateAppVersion', this.appversion
    ).then(res => {
      if (res && res.data) {
        this.appversion = res.data;
        this.appversionform.patchValue({
          id: this.appversion.id,
          versionType: this.appversion.versionType
        });

        this.toastrService.success('Success', 'Update Successfully');
      }
    });
  }
}


async GetCurrentVerion() {
  let res = await this.genericService.ExecuteAPI_Get<IResponse>('Dashboard/GetAllAppVersions')

  if (res && res.data && res.data.length > 0) {

    this.appversion = res.data[0];


    this.appversionform.patchValue({
      id: this.appversion.id,
      versionType: this.appversion.versionType
    });
  }
}


  pageChanged(obj: any) { }









}
