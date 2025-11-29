import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IStockPosting } from 'src/app/interfaces/Report/stockposting';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrl: './collection-report.component.css'
})
export class CollectionReportComponent {
  fromDate: any = null;
  toDate: any = null;

  productId: number;
  stockposting: IStockPosting[] = [];

  selectedProductId: string   = "0";
  selectedCategoryId: number  = 0;
  productdroupdown: any[] = [];

  action: string = 'new';
  buttonText: string = 'Submit';
  today = new Date();
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
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private genericService: GenericService,
    private router: Router
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Invoice',
      ColumnName: 'invoiceId',
      Type: 'string',
      Is_Visible: true,
    });
     this.gridFilter.push(<GridFilter>{
      DisplayText: 'Date',
      ColumnName: 'date',
      Type: 'date',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Customer',
      ColumnName: 'customer',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Address',
      ColumnName: 'address',
    Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Amount',
      ColumnName: 'amount',
      Type: 'number',
      CurrencyName:'INR',
      Is_Price: true,
      Is_Visible: true,
       Is_Sum  :true
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Type',
      ColumnName: 'paymentType',
      Type: 'string',
      Is_Visible: true,
       
    });
    

    // this.gridFilter.push(<GridFilter>{
    //   DisplayText: 'Edit',
    //   ColumnName: 'Action',
    //   Type: 'string',
    //   Actions: this.actions,
    //   Is_Visible: true,
    // });

    this.categories = [];
  }

  ngOnInit(): void {
     
    this.fromDate = new Date(this.formatDate());
     
    this.toDate =new Date(this.startDate());
    
    
    this.GetStockPosting(this.datePipe.transform(this.fromDate, 'yyyy-MM-dd') || '', this.datePipe.transform(this.toDate, 'yyyy-MM-dd') || '');
    this.GetProductData();
  }

  async GetStockPosting(fromDate?: string, toDate?: string) {
    let parems = new HttpParams()
    .set("fromDate",fromDate)
    .set("toDate",toDate)
    .set("productId",this.selectedProductId)
    .set("categoryId",this.selectedCategoryId);

     
    

    const res = await this.genericService.ExecuteAPI_Get<IResponse>('SaleMasterApi/GetCollectionReport',parems);
    if (res && res.data) {
      this.stockposting = res.data;
    } else {
      this.stockposting = [];
      this.toastr.warning('No data found');
    }
  }

  async filterByDate() {
    if (!this.fromDate || !this.toDate) {
      this.toastr.warning('Please select both From and To date');
      return;
    }

    const from = this.fromDate;
    const to = this.toDate;
    await this.GetStockPosting(this.datePipe.transform(from, 'yyyy-MM-dd') || '', this.datePipe.transform(to, 'yyyy-MM-dd') || '');
  }

  async clearFilter() {
    
    this.selectedProductId = null;
    await this.GetStockPosting();
  }

  formatDate(): string {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() )
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  startDate(): string {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth()+ 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  async GetProductData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'ProductApi/GetProductDropdown'
    );
    if (res) {
      this.productdroupdown = res.data;
    }
  }

  pageChanged(obj: any) {}
}
