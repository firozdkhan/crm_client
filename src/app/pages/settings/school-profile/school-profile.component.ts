import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  NgZone,
  AfterViewInit,
  AfterContentInit,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { IUser } from 'src/app/user/interfaces/user';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/shared/models/common_model';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { ICity } from 'src/app/interfaces/dashboard/city';
import { GenericService } from 'src/app/services/generic.service.service';

import { StoredDataService } from 'src/app/services/stored-data.service';
import { IResponse } from 'src/app/interfaces/response';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';

import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICommonRegion } from 'src/app/interfaces/settings/dropDown';
import { ICountry } from 'src/app/interfaces/settings/region-list';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrls: ['./school-profile.component.scss'],
  providers: [DatePipe],
})
export class SchoolProfileComponent implements OnInit, AfterContentInit {
  @ViewChild('mymodal') mymodal!: ElementRef;
  currentDate;
  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,

    private genericService: GenericService,
    private toastrService: ToastrService,

    private storedData: StoredDataService,

    private modalService: NgbModal,

    private router: Router,
    private datePipe: DatePipe,
    private trans: TranslatePipe
  ) {
    this.currentDate = this.datePipe.transform(new Date(), 'dd MMM yyyy');
    this.user$ = this.storedData.user$;
    this.changeDateformat = new ChangeDatePipe(this.datePipe);
  }

  user$: any;
  isActive: boolean = false;
  changeDateformat: any;
  fileUrl: string = environment.Base_File_Path;
  directory: string = 'Images';
  profile: ISchoolProfile;
  schoolLogo: string = environment.imageIcon;
  signatureImage: string = environment.imageIcon;
  profileForm: FormGroup;

  stateId: number;
  cityId: number;
  regionId: number;
  activateDate: Date = new Date();
  expiredDate: Date = new Date();
  // city: ICommonValue[] = [];
  // currentDateAndTime:string;
  regionData: ICountry[];
  region: ICommonRegion[];
  regionName: string;

  city: ICity[];
  keyDisabled: boolean = false;
  key: string;

  onUpdateDisable: boolean = false;

  ngAfterContentInit() {}

  ngOnInit() {
    this.expiredDate.setFullYear(this.expiredDate.getFullYear() + 1);
    this.createCategoryForm();
    this.bindData();

    // console.log(this.currentDateAndTime);
    //  this.profileForm.controls['contactNo'].patchValue("52222");
    // console.log("Contact No.", this.profileForm.get('contactNo').value);
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<ISchoolProfile>(
      'Core/GetCompanyProfile'
    );
     
    this.getCity(res.stateId);

    if (res as ISchoolProfile) {
      this.profile = res;

      this.profileForm.patchValue(this.profile);
      if (res.schoolLogo) {
        this.schoolLogo = this.fileUrl + res.schoolLogo;
      }
      if (res.signature) {
        this.signatureImage = this.fileUrl + res.signature;
      }
    }
  }

  showPackage() {
    this.modalService.open(this.mymodal!);
  }

  async getCity(stateId: number = null) {
    if (stateId) {
      return await this.storedData.cityData$.subscribe((city) => {
        // now you have the parkings array, loop over it
        this.city = city.filter((v) => v.stateId === stateId);
        this.profileForm.controls['cityId'].patchValue('');
      });
    } else {
      return await this.storedData.cityData$.subscribe((city) => {
        // now you have the parkings array, loop over it
      });
    }
  }

  createCategoryForm() {
    this.profileForm = this.fb.group({
      id: [
        0,
        [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      name: ['', Validators.required],
      address: ['', Validators.required],
      stateId: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      cityId: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      contactNo: ['', [Validators.required]],
      gstNumber: ['', [Validators.required]],
      adminContact: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ],
      email: ['', Validators.required],
      website: [''],
      // affilationNo: [''],
      // registrationNo: [''],
      // schoolCdoe: [''],
      facebook: [''],
      youTube: [''],
      twitter: [''],
      instagram: [''],
      signature: [''],
      schoolLogo: [''],
      // activationKey: [''],
      validkey: ['', Validators.required],
      // activationDate: [''],
      // expiryDate: [''],
      // isPasswordChanged:[],
      // isAgree:['', [Validators.required]],
      regionId: [0],
      aliceName: [''],
    });
  }

  cancel(): void {
    this.createCategoryForm();
  }

  onSubmit(): void {
    this.editCategories();
  }

  pageChanged(obj: any) {}

  async editCategories() {
    // if(this.profileForm.value.packageCode == null || this.profileForm.value.packageCode == '')
    //   {
    //     Swal.fire({
    //       title: this.trans.transform('Warring'),
    //       text: this.trans.transform('Please, enter a valid SKU Code !!'),
    //       icon: 'warning',
    //       showCancelButton: false,

    //     });
    //     return;
    //   }

    if (
      this.profileForm.value.regionId == 0 ||
      this.profileForm.value.regionId == null ||
      this.profileForm.value.regionId == ''
    ) {
      Swal.fire({
        title: this.trans.transform('Region is compulsory field !!'),
        text: this.trans.transform('Please, select your country as region !!'),
        icon: 'warning',
        showCancelButton: false,
      });
      return;
    }

     
    this.profile = this.profileForm.value;

    let res = await this.genericService.ExecuteAPI_Post<ISchoolProfile>(
      'Core/AddCompnayProfile',
      this.profile
    );
    if (res) {
      // let token = localStorage.getItem('token');
      this.storedData.loadCurrentUser();

      this.toastrService.success('Success', 'Profile update successfully');
      this.onUpdateDisable = true;
      let user: IUser;
      this.user$.subscribe((x) => {
        user = x;
        if (user.isPasswordChanged == false) {
          return this.router.navigate(['/settings/change-password']);
        }
      });
      console.log(user);
    }
  }

  async logoUploadResponse($event: string) {
     
    await this.profileForm.controls['schoolLogo'].patchValue($event);

    // this.schoolLogo = this.fileUrl + $event;
  }

  async signatureUploadResponse($event: string) {
    await this.profileForm.controls['signature'].patchValue($event);

    // this.signatureImage = this.fileUrl + $event;
  }
}
