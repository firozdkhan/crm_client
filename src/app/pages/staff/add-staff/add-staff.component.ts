import { GenericTableComponent } from './../../../shared/generic-table/generic-table.component';
import { filter } from 'rxjs/operators';
import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/services/generic.service.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { IResponse } from 'src/app/interfaces/response';
import { IAddstaffallowance, IAddstaffdeduction, IEmployee, IStaffDocumentDto, IStaffLeaveAssignment } from 'src/app/interfaces/staf/staff';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { ActivatedRoute, Router } from '@angular/router';
import { IShiftCategory } from 'src/app/interfaces/master/shift-category';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { HttpParams } from '@angular/common/http';
import { IAllowance } from 'src/app/interfaces/staf/allowance';
import { IDeduction } from 'src/app/interfaces/staf/deduction';
import { ILeaveMaster } from 'src/app/interfaces/master/leavemaster';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { ICity } from 'src/app/interfaces/dashboard/city';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css'],
})
export class AddStaffComponent implements OnInit, OnChanges {
  employeeData: any;
  staffEvent: any;
  resetDocumentList: any;
  gridFilter: Array<GridFilter> = [];
  action: string = 'new';
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit', },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete', },
  ];
  changeDateformat: any;
  currentDate: string;
  file_url: string = environment.Base_File_Path;
  registrationForm: FormGroup;
  employee = {} as IEmployee;
  employeelist: IEmployee[] = [];
  buttonText: string = 'Submit';
  checked: boolean = false;
  fileUrl = environment.Base_File_Path;
  employeeDocuments: IStaffDocumentDto[] = [];
  directory = 'Temp';
  id: any;
  staffId: any;
  employeeProfilePhoto = environment.studentProfileImage;
  filUrl = environment.Base_File_Path;
  today = new Date();
  userName: string;
  staffTime: ICommonValue[];
  countryData: ICommonValue[];
  stateData: ICommonValue[];
  cityData: ICommonValue[];

  allowances: IAllowance[] = [];
  deductions: IDeduction[] = [];

  countryId: number = 0;
  ///// Leave Master //////
  leavemaster: ILeaveMaster[] = []

  addstaffallowance: IAddstaffallowance[] = [];
  addstaffdeduction: IAddstaffdeduction[] = [];
  addstaffleaveassignment: IStaffLeaveAssignment[] = [];
  postId: number = 0;
  cityId: number;
  statedata: Array<ICommonValue>;
  citi: ICity[];

  uStateId: string;


  constructor(
    private fb: FormBuilder, private toaster: ToastrService, private genericService: GenericService, private datepipe: DatePipe, private activeRoute: ActivatedRoute,
    private route: Router, private storedData: StoredDataService
  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Name', ColumnName: 'empName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Company Name', ColumnName: 'companyName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Category Name', ColumnName: 'categoryName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Departmen Name', ColumnName: 'departmentName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Staff Category Name', ColumnName: 'staffCategory', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Shift Master Names', ColumnName: 'shiftMasterNames', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Designation Name', ColumnName: 'designationName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Device Name', ColumnName: 'deviceName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Leave Name', ColumnName: 'leaveName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Address', ColumnName: 'address', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Mobile', ColumnName: 'phoneNumber', Type: 'number', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Father Name', ColumnName: 'fatherName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Mother Name', ColumnName: 'motherName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Email', ColumnName: 'email', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Gender', ColumnName: 'genderName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Post Name', ColumnName: 'staffPostName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true, });
    this.changeDateformat = new ChangeDatePipe(this.datepipe);
    this.activeRoute.queryParams.subscribe((params) => {
      this.staffId = params['staffId'];
    });

    this.storedData.stateData$.subscribe((x) => {
      this.statedata = x;
    });

    this.storedData.cityData$.subscribe((misc) => {


      this.cityData = misc.map(
        (m) =>
          <ICommonValue>{
            id: m.id.toString(),
            name: m.name,
          }
      );
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetForm'] && changes['resetForm'].currentValue) {
      this.cancel();
    }
    if (this.employeeData) {
      this.employee = changes['employeeData'].currentValue;
      this.employeeProfilePhoto = this.fileUrl + this.employee.imgPath;
      this.employeeDocuments = this.employee.staffDocuments;
      this.addstaffallowance = this.employee.staffAllowances;
      this.addstaffdeduction = this.employee.staffDeductions;
      this.addstaffleaveassignment = this.employee.staffLeaveAssignment; // Staff leave Assigment ////


      this.registrationForm.patchValue(this.employee);
      if (this.addstaffleaveassignment && this.addstaffleaveassignment.length > 0) {
        this.setLeaveAssignments(this.addstaffleaveassignment);
      }


    }
  }
  setLeaveAssignments(assignments: IStaffLeaveAssignment[]) {
    const formArray = this.registrationForm.get('staffLeaveAssignment') as FormArray;
    formArray.clear();

    assignments.forEach(a => {
      formArray.push(this.fb.group({
        id: [a.id || 0],
        staffId: [a.staffId || this.staffId],
        staffName: [a.staffName || this.employee.empName || ''],
        leaveId: [a.leaveId],
        leaveName: [a.leaveName],
        leaveDays: [a.leaveDays]
      }));
    });
  }

  get staffLeaveArray(): FormArray {
    return this.registrationForm.get('staffLeaveAssignment') as FormArray;
  }

  async ngOnInit() {
    this.createRegistrationForm();
    this.ShiftTime();
    this.GetLeaveMasterdata();
    if (this.countryData && this.countryData.length > 0) {
      this.registrationForm.controls['countryId'].setValue(78);
    }

    1
    if (this.staffId && this.staffId > 0) {
      await this.loadStaffData(this.staffId);


      if (this.uStateId) {
        await this.getCity(this.uStateId);
      }
      //

      for (let i = 0; i < this.allowances.length; i++) {
        this.updateApproximateAmount(this.allowances[i]);
      }
      for (let i = 0; i < this.deductions.length; i++) {
        this.updateApproximateAmounts(this.deductions[i]);
      }
    } else {
      // Add mode
      await this.getNewEmpCodeFromAPI();
    }
    // this.getNewEmpCodeFromAPI();
  }

  async loadStaffData(staffId: any) {


    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      `Staff/GetStaffById?staffId=${staffId}`
    );
    if (res.isSuccess) {
      this.employee = res.data;
      this.uStateId = this.employee.stateId;
      this.employee.empCode = this.employee.empCode;
      this.employee.dob = this.datepipe.transform(
        this.employee.dob,
        'dd MMM yyyy'
      );
      this.employee.dateOfJoining = this.datepipe.transform(
        this.employee.dateOfJoining,
        'dd MMM yyyy'
      );
      for (let i = 0; this.employee.staffDocuments.length > i; i++) {
        this.employeeDocuments = this.employee.staffDocuments.map(
          (document) =>
            <IStaffDocumentDto>{
              id: document.id,
              documentId: document.documentId,
              documentName: document.documentName,
              staffId: document.staffId,
              staffName: document.staffName,
              filePath: document.filePath,
            }
        );
      }
      //patchValue//
      this.registrationForm.patchValue(this.employee);
      this.employee.dob = this.datepipe.transform(
        this.employee.dob,
        'dd MMM yyyy'
      );
      this.employee.dateOfJoining = this.datepipe.transform(
        this.employee.dateOfJoining,
        'dd MMM yyyy'
      );
      this.postId = this.registrationForm.value.postId;
      if (this.postId != 0) {

        let params = new HttpParams().set('id', this.employee.id);
        let res = await this.genericService.ExecuteAPI_Get<IResponse>(
          'MasterAllowance/Get_Allowance_Deduction_OnUpdate',
          params
        );

        if (res.isSuccess) {

          this.allowances = res.data.result;

          this.deductions = res.data.result1;

          console.log(res.data);
        } else {
        }
      }

      this.employeeProfilePhoto = this.file_url + res.data.imgPath;
      this.buttonText = 'Update';
      this.action = 'edit';
    } else {
    }
  }

  //shifttime//

  async ShiftTime() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'StaffShiftTime/GetStaffShiftTimeDroupdown'
    );
    if (res) {
      this.staffTime = res.data;
    }
  }


  createRegistrationForm() {
    this.registrationForm = this.fb.group({
      id: [0],
      empCode: ['',],
      empName: ['', Validators.required],
      locationFetching: [false, Validators.required],
      companyId: ['', Validators.required],
      departmentId: ['', Validators.required],
      designationId: ['', Validators.required],
      // categoryId: ['', Validators.required],
      machineID: ['', Validators.required],
      // leaveId: ['', Validators.required],
      postId: ['', Validators.required],
      email: ['', [ValidatorService.vEmail,]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],],
      address: [''],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      staffShiftMasterId: ['', Validators.required],
      shiftMasterNames: [''],
      dateOfJoining: [this.today, Validators.required],
      fatherName: ['', Validators.required],
      // weekOffId: ['',],
      countryId: ['', Validators.required],
      motherName: ['',],
      genderId: ['', Validators.required],
      dob: [this.today, Validators.required],
      imgPath: [''],
      basicSalary: ['', Validators.required],
      staffLeaveAssignment: this.fb.array([])

    });
  }

  stateId: number;

  ////// Leave Test ////////////////
  get staffLeaveAssignment(): FormArray {
    return this.registrationForm.get('staffLeaveAssignment') as FormArray;
  }
  get leaves(): FormArray {
    return this.registrationForm.get('leaves') as FormArray;
  }

  ////// Leave Test ////////////////

  stateChange(state: ICommonValue) {
    this.getCity(state.id.toString());
    this.registrationForm.controls['cityId'].setValue(null);
    this.cityId = null;
  }

  async getCity(stateId: string) {

    if (stateId) {

      this.storedData.cityData$.subscribe((city) => {
        this.citi = city.filter((v) => v.stateId === +stateId);

        // const selectedCity = this.citi.find((c) => c.id === this.registrationForm[0].cityId);
        const selectedCity = this.citi.find((c) => c.id === this.registrationForm.controls['cityId'].value);

        if (selectedCity) {
          this.registrationForm.controls['cityId'].setValue(selectedCity.id);
        }
      });
    }
  }

  async addNewState(stateId: number = null) {
    this.stateId = stateId;
    this.registrationForm.controls['stateId'].setValue(stateId);
    this.storedData.cityData$.subscribe((city) => {
      this.citi = city.filter((v) => v.stateId === +stateId);
    });
  }

  countryChange(country: any) {
    this.countryId = country;
  }

  async bindStaff() {
    const res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Staff/GetAllStaff'
    );
    if (res) {
      this.employeelist = res.data;
    }
  }

  async onSubmit(form: FormGroup) {
    debugger

    if (form.valid) {
      this.employee = this.registrationForm.value;
      this.employee.dateOfJoining = this.changeDateformat.transform(
        this.registrationForm.controls['dateOfJoining'].value
      );
      this.employee.dob = this.changeDateformat.transform(this.registrationForm.controls['dob'].value);
      console.log("Leaves Data:", this.employee.staffLeaveAssignment);
      this.employee.staffDocuments = this.employeeDocuments;


      const leaveArray = this.registrationForm.get('staffLeaveAssignment') as FormArray;
      this.employee.staffLeaveAssignment = leaveArray.value.map(
        (x: IStaffLeaveAssignment) => <IStaffLeaveAssignment>{
          id: x.id || 0,
          staffId: this.employee.id,
          staffName: this.employee.empName,
          leaveId: x.leaveId,
          leaveName: x.leaveName,
          leaveDays: x.leaveDays
        }
      );

      if (this.buttonText === 'Submit') {
        // mapping for staffallowance
        this.employee.staffAllowances = this.addstaffallowance.map(
          (x) =>
            <IAddstaffallowance>{
              id: 0,
              staffId: this.employee.id,
              staffName: this.employee.empName,
              miscAllowanceId: x.miscAllowanceId,
              miscAllowanceName: x.miscAllowanceName,
              postId: x.postId,
              staffPostName: x.staffPostName,
              inPercent: x.inPercent,
              approximateAmount: x.approximateAmount,
              type: x.type,
            }
        );

        // mapping for deduction
        this.employee.staffDeductions = this.addstaffdeduction.map(
          (x) =>
            <IAddstaffdeduction>{
              id: 0,
              staffId: this.employee.id,
              staffName: this.employee.empName,
              miscDeductionId: x.miscDeductionId,
              miscDeductionName: x.miscDeductionName,
              postId: x.postId,
              staffPostName: x.staffPostName,
              inPercent: x.inPercent,
              approximateAmount: x.approximateAmount,
              type: x.type,
            }
        );
        const leaveArray = this.registrationForm.get('staffLeaveAssignment') as FormArray;
        this.employee.staffLeaveAssignment = leaveArray.value.map(x => ({
          id: x.id || 0,
          staffId: this.employee.id,
          staffName: this.employee.empName,
          leaveId: x.leaveId,
          leaveName: x.leaveName,
          leaveDays: x.leaveDays
        }));

        let res = await this.genericService.ExecuteAPI_Post<IResponse>(
          'Staff/AddNewStaff',
          this.employee
        );
        if (res.isSuccess) {
          this.employeelist = res.data;
          this.toaster.success(res.message);
          this.cancel();
        } else {
          this.toaster.error(res.message);
        }
      } else {
        this.employee.staffAllowances = this.addstaffallowance.map(
          (x) =>
            <IAddstaffallowance>{
              id: 0,
              staffId: this.employee.id,
              staffName: this.employee.empName,
              miscAllowanceId: x.miscAllowanceId,
              miscAllowanceName: x.miscAllowanceName,
              postId: x.postId,
              staffPostName: x.staffPostName,
              inPercent: x.inPercent,
              approximateAmount: x.approximateAmount,
              type: x.type,
            }
        );

        // mapping for deduction
        this.employee.staffDeductions = this.addstaffdeduction.map(
          (x) =>
            <IAddstaffdeduction>{
              id: 0,
              staffId: this.employee.id,
              staffName: this.employee.empName,
              miscDeductionId: x.miscDeductionId,
              miscDeductionName: x.miscDeductionName,
              postId: x.postId,
              staffPostName: x.staffPostName,
              inPercent: x.inPercent,
              approximateAmount: x.approximateAmount,
              type: x.type,
            }
        );
        const leaveArray = this.registrationForm.get('staffLeaveAssignment') as FormArray;
        this.employee.staffLeaveAssignment = leaveArray.value.map((x: IStaffLeaveAssignment) => ({
          id: x.id || 0,
          staffId: this.employee.id,
          staffName: this.employee.empName,
          leaveId: x.leaveId,
          leaveName: x.leaveName,
          leaveDays: x.leaveDays
        }));
        console.log(this.employee)

        let res = await this.genericService.ExecuteAPI_Put<IResponse>(
          'Staff/UpdateStaff',
          this.employee
        );
        if (res.isSuccess) {
          this.toaster.success(res.message);
          this.route.navigateByUrl('/staff/staff-report');
          this.cancel();
        } else {
          this.toaster.error(res.message);
        }
        console.log(this.registrationForm.value);
      }
    }
  }

  cancel(): void {
    this.today = new Date();
    this.createRegistrationForm();
    this.employeeProfilePhoto = environment.imageIcon;
    this.employeeDocuments = [];

  }

  addOrRemoveDocumentList($event: IStaffDocumentDto[]) {
    debugger
    console.log('Document Event: ', $event);
    this.employeeDocuments = $event;
  }

  employeePhotoUploadResponse($event: string) {
    if (this.registrationForm && this.registrationForm.controls['imgPath']) {
      this.registrationForm.controls['imgPath'].patchValue('temp/' + $event);
      this.employeeProfilePhoto = this.file_url + 'temp/' + $event;
    } else {
    }
  }

  changeSwitch(value: boolean) {
    this.checked = value;
  }

  deleteStaff(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await this.genericService.ExecuteAPI_Delete<IResponse>(
            `Staff/DeleteStaff?id=${id}`
          );
          if (res.isSuccess) {
            this.toaster.success(res.message);
            this.bindStaff();
          } else {
            this.toaster.error(res.message);
          }
        } catch { }
      }
    });
  }

  //change value//
  async onPostChange(id) {
    let params = new HttpParams().set('id', id);
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'MasterAllowance/Get_Allowance_Deduction',
      params
    );
    if (res.isSuccess) {
      this.allowances = res.data.result.filter((x) => x.type === 'Allowance');
      this.addstaffallowance = res.data.result.filter(
        (x) => x.type === 'Allowance'
      );
      console.log(res.data.result);
      this.deductions = res.data.result1.filter((x) => x.type === 'Deduction');
      this.addstaffdeduction = res.data.result1.filter(
        (x) => x.type === 'Deduction'
      );
      console.log(res.data.result1);
    } else {
    }
  }

  updateApproximateAmount(allowance: IAllowance) {

    let basicSalary = this.registrationForm.controls['basicSalary'].value;
    allowance.approximateAmount = (allowance.inPercent * +basicSalary) / 100;
    this.addstaffallowance = this.allowances.map((x) => ({
      id: x.id,
      staffId: this.employee.id,
      staffName: this.employee.empName,
      miscAllowanceId: x.miscAllowanceId,
      miscAllowanceName: x.miscAllowanceName,
      postId: x.postId,
      staffPostName: x.staffPostName,
      inPercent: x.inPercent,
      approximateAmount: x.approximateAmount,
      type: x.type,
    }));
  }
  updateApproximateAmounts(deduction: IDeduction) {
    let basicSalary = this.registrationForm.controls['basicSalary'].value;
    deduction.approximateAmount = (deduction.inPercent * +basicSalary) / 100;
    this.addstaffdeduction = this.deductions.map((x) => ({
      id: x.id,
      staffId: this.employee.id,
      staffName: this.employee.empName,
      miscDeductionId: x.miscDeductionId,
      miscDeductionName: x.misDeductionName,
      postId: x.postId,
      staffPostName: x.staffPostName,
      inPercent: x.inPercent,
      approximateAmount: x.approximateAmount,
      type: x.type,
    }));
  }
  ///////////////////////////////////// Get Leave MAster data for showing ,on Get ////////////////////////////////////



  async GetLeaveMasterdata() {
    let res = await this.genericService.ExecuteAPI_Get<ILeaveMaster>('LeaveMaster/GetAllLeave');
    if (res.isSuccess) {
      this.leavemaster = res.data;

      const staffLeaveArray = this.fb.array<FormGroup>([]);

      this.leavemaster.forEach(l => {
        staffLeaveArray.push(
          this.fb.group({
            id: [0],
            staffId: [this.staffId || 0],
            staffName: [this.employee.empName || ''],
            leaveId: [l.leaveId],
            leaveName: [l.leave],
            leaveDays: [l.leaveDays]
          })
        );
      });

      this.registrationForm.setControl('staffLeaveAssignment', staffLeaveArray);
    }
  }

  onLeaveDaysChange(leave: IStaffLeaveAssignment) {
    const control = this.registrationForm.get('staffLeaveAssignment') as FormArray;
    const index = control.controls.findIndex(c => c.get('leaveId').value === leave.leaveId);

    if (index !== -1) {

      control.at(index).patchValue({
        leaveDays: leave.leaveDays
      });
    } else {

      control.push(this.fb.group({
        id: [leave.id],
        staffId: [leave.staffId],
        staffName: [leave.staffName],
        leaveId: [leave.leaveId],
        leaveName: [leave.leaveName],
        leaveDays: [leave.leaveDays]
      }));
    }
  }
  ///////////////////////////// EMP COde Generated /////////////////////////////

  // Async / await approach
  async getNewEmpCodeFromAPI() {
    try {
      const res = await this.getNewEmpCode();
      if (res?.isSuccess && res?.data?.empCode) {
        this.registrationForm.patchValue({
          empCode: res.data.empCode
        });
      }
    } catch (error) {
      console.error("Error generating EmpCode", error);
    }
  }


  getNewEmpCode() {
    return this.genericService.ExecuteAPI_Get('Staff/GenerateEmpCode');
  }
}
