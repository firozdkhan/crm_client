import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { IEmployee, IEmployeeDoc } from 'src/app/interfaces/staf/staff';
import { environment } from 'src/environments/environment';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { Router } from '@angular/router';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-staff-partial',
  templateUrl: './staff-partial.component.html',
  styleUrls: ['./staff-partial.component.scss']
})
export class StaffPartialComponent implements OnInit, OnChanges {

  @Output() staffEvent = new EventEmitter<IEmployee>();
  @Input('employeeData') employeeData: IEmployee;
  @Input('resetForm') resetForm: boolean = false;
  @Output() resetDocumentList = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    // private datepipe: DatePipe,
  ) {
    // this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }
  changeDateformat: any;
  currentDate: string;
  file_url: string = environment.Base_File_Path;
  registrationForm: FormGroup;
  employee = {} as IEmployee;
  sessionId = localStorage.getItem('smart_Sessionid');
  checked: boolean = false;
  fileUrl = environment.Base_File_Path;
  miscCategory: ICategoryLabels = CategoryLabelData;
  employeeDocuments: IEmployeeDoc[] = [];
  directory = "Temp";
  id: string;
  employeeProfilePhoto: string = environment.imageIcon;
  today = new Date();
  userName: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetForm'] && changes['resetForm'].currentValue) {
      this.cancel();
    }
    if (this.employeeData) {
      this.employee = changes['employeeData'].currentValue;
      this.employee = this.employeeData;
      // this.employeeProfilePhoto = this.fileUrl + this.employee.photoUrl;
      // this.employeeDocuments = this.employee.employeeDoc;
      this.registrationForm.patchValue(this.employee);
      // this.userName = this.employee.name.replace(/ /g, '').toLowerCase();
      // this.registrationForm.controls["userName"].patchValue(this.userName);
    }
  }

  ngOnInit(): void {
    this.createRegistrationForm();
  }

  createRegistrationForm() {
    this.registrationForm = this.fb.group({
      id: [0, [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      dob: [this.today, [Validators.required]],
      name: [null, Validators.required],
      emergencyNo: [null, [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      mobileNo: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],

      maritalStatus: [false, [Validators.required]],
      gender: [null, [Validators.required]],
      fatherName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      motherName: [null, [Validators.required]],
      joiningDate: [this.today, [Validators.required]],
      departmentId: [null, [Validators.required]],
      designationId: [null, [Validators.required]],
      currentAddress: [null, [Validators.required]],
      currentCityId: [null, [Validators.required]],
      photoUrl: [null],
      userId: [null],
      emailId: [null, [ValidatorService.vEmail]]
    });
  }

  async onSubmit() {
    if (this.registrationForm.valid) {
      this.employee = this.registrationForm.value;
      // this.employee.dob = this.changeDateformat.transform(this.employee.dob);
      // this.employee.joiningDate = this.changeDateformat.transform(this.employee.joiningDate);
      // this.employee.employeeDoc = this.employeeDocuments.map(document => <IEmployeeDoc>{
      //   documentId: document.documentId,
      //   fileUrl: document.fileUrl
      // });

      this.staffEvent.emit(this.employee);
      this.resetDocumentList.emit();
      this.createRegistrationForm();
      this.employeeDocuments = [];
      this.registrationForm.controls['photoUrl'].reset();
      this.employeeProfilePhoto = environment.imageIcon;
      // this.toaster.success('Data has been saved');
      this.router.navigateByUrl('/staff/add-staff');
    } else {
      this.toaster.error("Please fill all required fields correctly.");
    }
  }

  cancel(): void {

    this.today = new Date();
    this.createRegistrationForm();
    this.employeeProfilePhoto = environment.imageIcon;
    this.employeeDocuments = [];
    // this.router.navigateByUrl("/staff/update-staff");
  }

  addOrRemoveDocumentList($event: IEmployeeDoc[]) {

    this.employeeDocuments = $event;
  }

  employeePhotoUploadResponse($event: string) {
    this.registrationForm.controls["photoUrl"].patchValue("temp/" + $event);
    this.employeeProfilePhoto = this.file_url + "temp/" + $event;
  }

  changeSwitch(value: boolean) {
    this.checked = value;
  }
  addUserName(event: string) {
    if (!this.employeeData) {
      this.userName = event.replace(/ /g, '').toLowerCase();
      this.registrationForm.controls["userName"].patchValue(this.userName);
    }


  }
}
