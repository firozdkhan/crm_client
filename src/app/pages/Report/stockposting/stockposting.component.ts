import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IStockPosting } from 'src/app/interfaces/Report/stockposting';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';

@Component({
  selector: 'app-stockposting',
  templateUrl: './stockposting.component.html',
  styleUrl: './stockposting.component.css',
})
export class StockpostingComponent {
  fromDate: any = null;
  toDate: any = null;

  productId: number;
  stockposting: IStockPosting[] = [];

  selectedProductId: number | null = null;
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
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private genericService: GenericService,
    private router: Router
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Product Name',
      ColumnName: 'productName',
      Type: 'string',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Date',
      ColumnName: 'invoiceDate',
      Type: 'date',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Invoice No',
      ColumnName: 'invoiceNo',
      Type: 'string',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Inward Qty',
      ColumnName: 'inwardQty',
      Type: 'number',
      Is_Visible: true,
      Is_Sum: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: ' Outward Qty',
      ColumnName: 'outwardQty',
      Type: 'number',
      Is_Visible: true,
      Is_Sum: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Balance Qty',
      ColumnName: 'remainingQty',
      Type: 'number',
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
    this.GetStockPosting();
    this.GetProductData();
  }

  async GetStockPosting(fromDate?: string, toDate?: string) {
    let url = 'StockPosting/GetAllStockPosting';
    let queryParams: string[] = [];

    if (fromDate) queryParams.push(`fromDate=${fromDate}`);
    if (toDate) queryParams.push(`toDate=${toDate}`);
    if (this.selectedProductId)
      queryParams.push(`productId=${this.selectedProductId}`);

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    const res = await this.genericService.ExecuteAPI_Get<IResponse>(url);
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

    const from = this.formatDate(this.fromDate);
    const to = this.formatDate(this.toDate);
    await this.GetStockPosting(from, to);
  }

  async clearFilter() {
    this.fromDate = null;
    this.toDate = null;
    this.selectedProductId = null;
    await this.GetStockPosting();
  }

  formatDate(date: any): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
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
}
