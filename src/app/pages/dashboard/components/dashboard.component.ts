import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  Action_Type,
  Badge_Type,
  GridFilter,
} from 'src/app/shared/controls/grid/common_model';
import { ILeaveApply } from 'src/app/interfaces/staf/leave';
import {
  IBirthdayStudent,
  ICategory,
  IDashboard,
  IDashboardLeave,
  IFinance,
  IStudent,
} from 'src/app/interfaces/dashboard/dashborad';
import { IResponse } from 'src/app/interfaces/response';
import { IApplystudent } from 'src/app/interfaces/student/applystudent';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import { IDashboardAccounting } from 'src/app/interfaces/AccountingDashboard/dashboard';
import { formatDate } from '@angular/common';
import { ITopTraders } from 'src/app/interfaces/AccountingDashboard/toptrader';
import { IBankDetails } from 'src/app/interfaces/accounting/bankdetails';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  baseUrl = environment.apiUrl;
  currency = 'INR';
  today: Date = new Date();

  topCustomers: ITopTraders[] = [];
  topSuppliers: ITopTraders[] = [];

  filterForm!: FormGroup;
  dashboard: IDashboardAccounting = {} as IDashboardAccounting;

  chartLabels: string[] = [];
  monthlyData: any[] = [];
  purchaseChartInstance: Chart | null = null;
  saleChartInstance: Chart | null = null;
  actions: Action_Type[] = [
    {
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
    },
    {
      class: 'btn-outline-success',
      text: null,
      font: 'fal fa-print',
      type: 'print',
    },
  ];
  categories: any[];
  gridFilter: Array<GridFilter> = [];
  constructor(
    private fb: FormBuilder,
    private genericService: GenericService,
    private toastr: ToastrService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Name',
      ColumnName: 'name',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Trade Count',
      ColumnName: 'tradeCount',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Total AAmount',
      ColumnName: 'totalAmount',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: ' Due Amount',
      ColumnName: 'dueAmount',
      Type: 'number',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'State',
      ColumnName: 'stateName',
      Type: 'string',
      Is_Visible: true,
    });

    this.categories = [];
  }

  ngOnInit() {
    this.GetTopCustomer();
    this.GetTopSupplier();
    this.initializeForm();
    this.GetDashboadCalculation();
    this.loadCompanyProfile();
    this.getMonthlySummary();
    this.GetTopProduct();
    this.GetBankData();
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    this.getMonthlySummary(firstDayOfMonth, currentDate);
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  formatDateToSend(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  onSubmit(): void {
    const formValues = this.filterForm.value;
    this.getMonthlySummary(formValues.fromDate, formValues.toDate);
  }

  async getMonthlySummary(fromDate?: Date, toDate?: Date) {
    const formattedFromDate = this.formatDateToSend(fromDate || this.today);
    const formattedToDate = this.formatDateToSend(toDate || this.today);

    const url = `Dashboard/GetMonthlySalePurchaseSummary?fromDate=${formattedFromDate}&toDate=${formattedToDate}`;

    try {
      const res = await this.genericService.ExecuteAPI_Get<IResponse>(url);
      console.log('Response:', res);

      if (res.isSuccess && res.data) {
        this.monthlyData = res.data;

        // FIX: Render charts after slight delay so canvas is ready
        setTimeout(() => {
          this.renderCharts();
        }, 100); // 100ms delay ensures canvas is available
      }
    } catch (error) {
      console.error('API error:', error);
    }
  }

  async renderCharts() {
    await this.renderPurchaseChart();
    await this.renderSaleChart();
  }

  renderPurchaseChart(): void {
    const labels = this.monthlyData.map((x) => x.monthName);
    const data = this.monthlyData.map((x) => x.purchaseTotal);

    if (this.purchaseChartInstance) {
      this.purchaseChartInstance.destroy();
    }

    const ctx = document.getElementById('purchaseChart') as HTMLCanvasElement;

    this.purchaseChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Purchase Amount (₹)',
            data: data,
            fill: true,
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78, 115, 223, 0.2)',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom' },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Amount (₹)' },
          },
        },
      },
    });
  }

  renderSaleChart(): void {
    const labels = this.monthlyData.map((x) => x.monthName);
    const data = this.monthlyData.map((x) => x.saleTotal);

    if (this.saleChartInstance) {
      this.saleChartInstance.destroy();
    }

    const ctx = document.getElementById('saleChart') as HTMLCanvasElement;

    this.saleChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sale Amount (₹)',
            data: data,
            fill: true,
            borderColor: '#1cc88a',
            backgroundColor: 'rgba(28, 200, 138, 0.2)',
            tension: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom' },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Amount (₹)' },
          },
        },
      },
    });
  }

  async GetDashboadCalculation() {
    let res: any =
      await this.genericService.ExecuteAPI_Get<IDashboardAccounting>(
        'Dashboard/DashboardCalculation'
      );

    if (res) {
      this.dashboard = res.data;
      console.log('Assigned Dashboard:', this.dashboard);
    } else {
      console.error('API error:', res?.message);
    }
  }

  // Company Profile
  countryid: any;
  currencyname: string = '';

  async loadCompanyProfile() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.countryId;
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

  ///////////////////////////// Top 10 Cutomer ///////////////////////

  async GetTopCustomer() {
     
    let res = await this.genericService.ExecuteAPI_Get<ITopTraders[]>(
      'Dashboard/GetTopCustomer'
    );

    if (res) {
      this.topCustomers = res;
    }
  }

  //////////////////////////////// Top 10 Suppliers //////////////////////

  async GetTopSupplier() {
    let res = await this.genericService.ExecuteAPI_Get<ITopTraders>(
      'Dashboard/GetTopSupplier'
    );

    if (res) {
      this.topSuppliers = res;
    }
  }

  ///////////////// Get products /////////////

  topProducts: ITopTraders[] = [];
  async GetTopProduct() {
    let res = await this.genericService.ExecuteAPI_Get<ITopTraders>(
      'Dashboard/GetTopProduct'
    );

    if (res.isSuccess) {
      this.topProducts = res.data;
    }
  }

  ////////////////////// Get BankDetails /////////////
  bankdata: IBankDetails;

  async GetBankData() {
    let res = await this.genericService.ExecuteAPI_Get<IBankDetails>(
      'BankDetailsApi/GetAllBankDetails'
    );

    if (res.isSuccess) {
      this.bankdata = res.data;
    }
  }
  pageChanged(event: any): void {
}
}
