import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from 'src/app/interfaces/response';
import { ISalary } from 'src/app/interfaces/staf/salary';
import { GenericService } from 'src/app/services/generic.service.service';

@Component({
  selector: 'app-salaryslip',
  templateUrl: './salaryslip.component.html',
  styleUrls: ['./salaryslip.component.css']
})
export class SalaryslipComponent {

  staffId!: number;
  month!: number;
  year!: number;
  salary!: ISalary;

  totalEarnings: number = 0;
  totalDeductions: number = 0;
  finalPayable: number = 0;

  constructor(
    private route: ActivatedRoute,
    private genericService: GenericService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.staffId = +params['staffId'];
      this.month = +params['month'];
      this.year = +params['year'];

      if (this.staffId && this.month && this.year) {
        this.getSalarySlip();
      }
    });
  }

  async getSalarySlip() {
    try {
      const res = await this.genericService.ExecuteAPI_Get<IResponse>(
        `StaffSalary/Get_StaffSalarySlip?staffId=${this.staffId}&month=${this.month}&year=${this.year}`
      );

      if (res && res.data) {
        this.salary = res.data as ISalary;
        this.calculateTotals();
      }
    } catch (err) {
      console.error('Error fetching salary slip:', err);
    }
  }

  calculateTotals() {
    if (!this.salary) return;

    const basic = this.salary.proratedBasicSalary || 0;
    const allowances = this.salary.updateAllowances?.reduce((t, x) => t + (x.allowanceAmount || 0), 0) || 0;
    const deductions = this.salary.updateDeductions?.reduce((t, x) => t + (x.deductionAmount || 0), 0) || 0;
    const absent = this.salary.absentAmount || 0;

    this.totalEarnings = basic + allowances;
    this.totalDeductions = deductions + absent;
    this.finalPayable = this.salary.advance || 0;
  }

  printSlip() {
    window.print();
  }
}
