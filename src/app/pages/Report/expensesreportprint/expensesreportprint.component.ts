import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IExpensesReport } from 'src/app/interfaces/Report/expensesreport';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';

@Component({
  selector: 'app-expensesreportprint',
  templateUrl: './expensesreportprint.component.html',
  styleUrl: './expensesreportprint.component.css',
})
export class ExpensesreportprintComponent {
  expenseData: IExpensesReport[] = [];

  companyProfile: ISchoolProfile;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private genericService: GenericService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        const res = await this.genericService.ExecuteAPI_Get<IResponse>(
          'Expense/GetExpenseReportById?id=' + id
        );

        if (res?.isSuccess) {
          this.expenseData = res.data;
        }
      }
    });
    this.GetCompanyProfile();
  }

  print() {
    window.print();
  }

  async GetCompanyProfile() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );
    if (res) {
      this.companyProfile = res;
    }
  }

  countryid: any;
  currencyname: string = '';

  async loadCompanyProfile() {
     
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.regionId;
      this.companyProfile = res;
      this.getCountryById(this.countryid);
    }
  }

  async getCountryById(id: number) {
    let response = await this.genericService.ExecuteAPI_Get<IResponse>(
      `Core/GetCountryById/${id}`
    );

    if (response.isSuccess) {
      this.currencyname = response.data.currency;
      console.log(this.currencyname);
    }
  }
}
