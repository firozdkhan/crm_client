import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { ISalary } from 'src/app/interfaces/staf/salary';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-salary',
  templateUrl: './staff-salary.component.html',
  styleUrls: ['./staff-salary.component.css']
})
export class StaffSalaryComponent implements OnInit {
  attendanceslist: ISalary[] = [];
  attendance: ISalary;
  attendanceForm: FormGroup;
  buttonText: string = "Show";
  buttonsText: string = "Submit";
  totalRecords: number;
  currentYear: number = new Date().getFullYear();
  currentmonth: number = new Date().getMonth();
  gridFilter: Array<GridFilter> = [];
  newSalary: number = 0;
  maxId: number = 0;
  today = new Date();
  paymentMode = 'Cash';
  paymodeId = 'Cash';



  monthsList: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private toastr: ToastrService, private generic: GenericService, private fb: FormBuilder, private trans: TranslatePipe, private route: Router, private cdr: ChangeDetectorRef,) { }

  payMode = [{ id: 'Cash', name: 'Cash' }, { id: 'Card', name: 'Card' }, { id: 'Cheque', name: 'Cheque' }, { id: 'Online', name: 'Online' },];

  ngOnInit() {
    this.createForm();

    this.attendanceForm.get('fromDate')?.valueChanges.subscribe((date: Date) => {
      if (date) {
        const month = new Date(date).getMonth() + 1;
        const year = new Date(date).getFullYear();
        this.GetWorkingDays(month, year);
      }
    });

  }

  createForm() {

    this.attendanceForm = this.fb.group({
      staffId: [null, Validators.required],
      selectedYear: [this.today.getFullYear(), Validators.required],
      selectedMonth: [this.today.getMonth() + 1, Validators.required],
      // TotalDays: [null]
    });
  }

  cancel() {
    this.createForm();
    this.today = new Date();
  }

  updateSalary() {
    if (!this.attendance) return;

    const att = this.attendance[0];

    // Total Allowances
    att.totalAllowances = att.updateAllowances?.reduce((sum, a) => sum + a.allowanceAmount, 0) || 0;

    // Total Deductions
    att.totalDeductions = att.updateDeductions?.reduce((sum, d) => sum + d.deductionAmount, 0) || 0;

    // Net Salary
    this.newSalary = att.proratedBasicSalary + att.totalAllowances - att.totalDeductions - (att.advance || 0);

    // Remaining
    att.remaning = this.newSalary;
  }


  Submit() {
    debugger;
    if (!this.attendance) {
      this.toastr.error("Attendance data missing!");
      return;
    }

    // string to convert int (Hours chnage in int for save in databse)
    const convertTimeToDecimal = (time: string | number) => {
      if (typeof time === 'string' && time.includes(':')) {
        const [hours, minutes] = time.split(':').map(Number);
        return Math.round(hours + minutes / 60);
      }
      return Math.round(Number(time));
    };

    const payload = {
      ...this.attendance,
      absentDays: convertTimeToDecimal(this.attendance.absentDays),
      // effectiveWorkingDays: convertTimeToDecimal(this.attendance.effectiveWorkingDays),
      // presentDays: convertTimeToDecimal(this.attendance.presentDays),
      netSalary: this.attendance.remaning
    };

    console.log("Submitting data:", payload);

    this.generic.ExecuteAPI_Post('StaffSalary/Save_UpdateStaffSalary', payload)
      .then((res: any) => {
        if (res.success) {
          this.toastr.success("Salary Updated Successfully");
          this.printForm();
        } else {
          this.toastr.error(res.message);
        }
      })
      .catch(() => {
        this.toastr.success("Salary Save Successfully");
      });
  }



  async printForm() {
    debugger;
    const result = await Swal.fire({
      title: this.trans.transform('Data Has Been Submitted Successfully !!'),
      text: this.trans.transform('Do you want to print last salary slip !!'),
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: this.trans.transform('Yes, Print it!'),
      cancelButtonText: this.trans.transform('No !!')
    });

    if (result.value) {

      try {
        let res = await this.generic.ExecuteAPI_Get<IResponse>("StaffSalary/Get_UpdateStaffSalary_MaxId")
        if (res.isSuccess) {
          this.attendance = res.data;
          this.route.navigateByUrl("/reports/prnit-page/" + this.attendance[0].id);
        }
      } catch (error) {
        Swal.fire(
          this.trans.transform('Error'),
          this.trans.transform('An error occurred while printing the form'),
          'error');
      }
    }
  }


  isAdvanceReadonly: boolean = false;
  isSalaryPaid: boolean = true;

  async onSubmit() {
    debugger
    const staffId = this.attendanceForm.controls["staffId"].value;
    const selectedYear = this.attendanceForm.controls["selectedYear"].value;
    const selectedMonth = this.attendanceForm.controls["selectedMonth"].value;

    try {
      let res = await this.generic.ExecuteAPI_Get<IResponse>(
        `StaffSalary/CalculateStaffSalary?staffId=${staffId}&year=${selectedYear}&month=${selectedMonth}`
      );

      if (res.isSuccess) {
        this.attendance = res.data;

        if (this.attendance.remaning === 0) {
          this.toastr.success("This month's salary has already been paid to the staff.");
          this.isSalaryPaid = true;
        } else {
          this.isSalaryPaid = false;
        }

      } else {
        this.attendance = null;
        this.isSalaryPaid = false;
        this.toastr.warning("No records found.");
      }
    } catch (error) {
      this.toastr.error("Error while fetching salary.");
      this.isSalaryPaid = false;
    }
  }




  reset() {
    this.attendanceForm.reset();
    this.attendanceslist = [];
    this.totalRecords = 0;
  }

  pageChanged(obj: any) {
  }

  // calculatenetSalary(attendance: any): number {
  //   if (!attendance) return 0;
  //   const allowances = (attendance.updateAllowances || []).reduce((sum: number, allowance: any) => sum + Number(allowance.allowanceAmount || 0), 0);
  //   const deductions = (attendance.updateDeductions || []).reduce((sum: number, deduction: any) => sum + Number(deduction.deductionAmount || 0), 0);
  //   const netSalaryBeforeAdvance = (attendance.proratedBasicSalary || 0) + allowances - deductions;
  //   const unpaidLeaves = Number(attendance.unpaidLeaves || 0);
  //   const perDaySalary = Number(attendance.perDaySalary || 0);
  //   const unpaidLeaveAmount = unpaidLeaves * perDaySalary;
  //   let salaryAfterLeaves = netSalaryBeforeAdvance - unpaidLeaveAmount;
  //   const totalPaid = (attendance.advance || 0) + (attendance.paid || 0);
  //   let remainingSalary = salaryAfterLeaves - totalPaid;
  //   if (remainingSalary < 0) {
  //     remainingSalary = 0;
  //   }
  //   attendance.totalAllowances = allowances;
  //   attendance.totalDeductions = deductions;
  //   attendance.unpaidLeaveAmount = unpaidLeaveAmount;
  //   attendance.netSalary = salaryAfterLeaves;
  //   attendance.remaning = remainingSalary;

  //   return attendance.netSalary;
  // }

  convertToDecimalHours(value: any): number {
    if (!value) return 0;
    if (typeof value === 'number') return value; // already numeric

    const parts = value.split(':');
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    return hours + minutes / 60;
  }

  calculatenetSalary(attendance: any): number {
    if (!attendance) return 0;


    const allowances = (attendance.updateAllowances || []).reduce((sum: number, allowance: any) => sum + Number(allowance.allowanceAmount || 0), 0);
    const deductions = (attendance.updateDeductions || []).reduce((sum: number, deduction: any) => sum + Number(deduction.deductionAmount || 0), 0);
    const advance = Number(attendance.advance || 0);
    const paid = Number(attendance.paid || 0);
    const unpaidLeaves = Number(attendance.unpaidLeaves || 0);
    const perDaySalary = Number(attendance.perDaySalary || 0);
    const unpaidLeaveAmount = unpaidLeaves * perDaySalary;

    let baseSalary = 0;


    if (this.calculationType === 'days') {

      baseSalary = Number(attendance.proratedBasicSalary || 0);
    } else {

      const effective = this.convertToDecimalHours(attendance.effectiveWorkingDays);
      const present = this.convertToDecimalHours(attendance.presentDays);
      const basic = Number(attendance.basicSalary || 0);
      baseSalary = effective > 0 ? (basic / effective) * present : 0;
    }

    // Calculate final salary
    const netSalaryBeforeAdvance = baseSalary + allowances - deductions - unpaidLeaveAmount;
    const totalPaid = advance + paid;
    let remainingSalary = netSalaryBeforeAdvance - totalPaid;

    if (remainingSalary < 0) remainingSalary = 0;

    // Update attendance object
    attendance.totalAllowances = allowances;
    attendance.totalDeductions = deductions;
    attendance.unpaidLeaveAmount = unpaidLeaveAmount;
    attendance.netSalary = netSalaryBeforeAdvance;
    attendance.remaning = remainingSalary;

    return attendance.netSalary;
  }





  OnPaymentChange($event) {
    this.paymentMode = $event;

    switch ($event) {
      case 'Cash':
        this.paymodeId = 'Cash';
        break;
      case 'Card':
        this.paymodeId = 'Card No.';
        break;
      case 'Cheque':
        this.paymodeId = 'Cheque No.';
        break;
      case 'Online':
        this.paymodeId = 'Order Id';
        break;
      default:
        console.log('No such payment mode exists!');
        break;
    }

    console.log("Payment Mode: ", this.paymentMode);
  }


  workingDaysData: any

  async GetWorkingDays(month: number, year: number) {
    try {
      let res: any = await this.generic.ExecuteAPI_Get<IResponse>(
        `StaffAttendanceReport/GetMonthWiseWorkingDays?month=${month}&year=${year}`
      );

      if (res.isSuccess) {
        this.attendanceForm.patchValue({
          totalCompanyWorkingDays: res.data.workingDays
        });
        this.workingDaysData = res.data;
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  }

  //////////////////////////////////////////// Working Hourse and Days wise Salary calculation ///////////////////////////

  calculationType: string = 'hours';

  async getSalaryDaysWise(staffId: number, year: number, month: number) {
    try {
      let res = await this.generic.ExecuteAPI_Get<IResponse>(`StaffSalary/CalculateStaffSalaryDaysWise?staffId=${staffId}&year=${year}&month=${month}`);
      if (res.isSuccess) {
        this.attendance = res.data;
        this.isSalaryPaid = this.attendance.remaning === 0;
        this.cdr.detectChanges();
      } else {
        this.attendance = null;
        this.toastr.warning("No salary data found (Days Wise)");
      }
    } catch (err) {
      this.toastr.error("Error loading salary days wise");
    }
  }


  async getSalaryHoursBased(staffId: number, year: number, month: number) {
    debugger;
    try {
      let res = await this.generic.ExecuteAPI_Get<IResponse>(
        `StaffSalary/CalculateStaffSalary?staffId=${staffId}&year=${year}&month=${month}`
      );
      if (res.isSuccess) {
        this.attendance = res.data;
        this.isSalaryPaid = this.attendance.remaning === 0;
      } else {
        this.attendance = null;
        this.toastr.warning("No salary data found");
      }
    } catch (err) {
      this.toastr.error("Error loading salary");
    }
  }




  async onCalculationTypeChange() {
    const staffId = this.attendanceForm.controls["staffId"].value;
    const selectedYear = this.attendanceForm.controls["selectedYear"].value;
    const selectedMonth = this.attendanceForm.controls["selectedMonth"].value;

    if (!staffId || !selectedYear || !selectedMonth) {
      this.toastr.warning("Please select Staff, Month & Year first");
      return;
    }

    if (this.calculationType === 'days') {
      await this.getSalaryDaysWise(staffId, selectedYear, selectedMonth);
    } else if (this.calculationType === 'hours') {
      await this.getSalaryHoursBased(staffId, selectedYear, selectedMonth);
    }
    setTimeout(() => { }, 0);
  }





}

