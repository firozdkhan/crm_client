import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IDailyWork } from 'src/app/interfaces/mis/dailyWork';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { ISearchFields } from 'src/app/shared/interfaces/search-fields';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';

@Component({
  selector: 'app-daily-work-report',
  templateUrl: './daily-work-report.component.html',
  styleUrl: './daily-work-report.component.css'
})
export class DailyWorkReportComponent implements OnInit {

  fromDate!: Date;
  toDate!: Date;
  userid:string;
    productData: ICommonValue[];
    
    customerdata: ICommonValue[] = [];
     searchForm: FormGroup;
     searchFields:ISearchFields;

  dailyWorkList: IDailyWork[] = [];
  gridFilter: GridFilter[] = [];

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

  ];

  constructor(
    private datePipe: DatePipe,
     private fb: FormBuilder,
    private toastr: ToastrService,
    private genericService: GenericService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.setTodayDates();
   
    this.setGridFilter();
    this.getProductData();
    this.GetCustomerDroupdown();
  }

   createForm() {
      this.searchForm = this.fb.group({
         
        customerId: [0],
        productId: [0],
        userId: [null],
        fromDate: [null, Validators.required],
        toDate: [null, Validators.required]
        
      });
    }
  
    async getProductData() {
      const res = await this.genericService.ExecuteAPI_Get<IResponse>('ProductApi/GetAllProduct');
      if (res.isSuccess) {
        
        this.productData = res.data.map((p) => <ICommonValue>{ id: p.id.toString(), name: p.productsName });
      }
    }
  
    async GetCustomerDroupdown() {
      let res = await this.genericService.ExecuteAPI_Get<IResponse>('CustomerApi/GetCustomerDropdown');
      if (res.isSuccess) {
        this.customerdata = res.data;
      }
    }
  

  setTodayDates() {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;
  }

  setGridFilter() {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'User Name',
      ColumnName: 'userName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Date',
      ColumnName: 'currentDate',
      Type: 'date',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Product',
      ColumnName: 'productName',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Customer',
      ColumnName: 'customerName',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Description',
      ColumnName: 'description',
      Type: 'string',
      Is_Visible: true,
    });

  


  }
  async loadData() {
    this.searchFields = this.searchForm.value;
    const params = new HttpParams()
      .set('fromDate', this.formatDate(this.searchFields.fromDate))
      .set('toDate', this.formatDate(this.searchFields.toDate))
      .set('productId', this.searchFields.productId)
      .set('customerId', this.searchFields.customerId)
      .set('userId',this.searchFields.userId)

    const res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'WorkReport/GetAllDailyWork',
      params
    );

    if (res.isSuccess) {
      this.dailyWorkList = res.data;
    } else {
      this.toastr.error(res.message || 'Failed to load data');
    }
  }

  async filterByDate() {
    if (!this.fromDate || !this.toDate) {
      this.toastr.warning('Please select both dates');
      return;
    }
    await this.loadData();
  }

  async clearFilter() {
    this.setTodayDates();
    await this.loadData();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
  pageChanged(obj: any) {}
}
