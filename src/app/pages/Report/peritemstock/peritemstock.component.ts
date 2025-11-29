import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPurchaseReport } from 'src/app/interfaces/Report/purchaseitem';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-peritemstock',
  templateUrl: './peritemstock.component.html',
  styleUrl: './peritemstock.component.css',
})
export class PeritemstockComponent {
  purchaseReports: IPurchaseReport[] = [];
  productId: number = 0;
  fromDate: string = '';
  toDate: string = '';

  action: string = 'new';
  buttonText: string = 'Submit';
  today = new Date();
  actions: Action_Type[] = [
    // {
    //   class: 'btn-outline-primary',
    //   text: null,
    //   font: 'fal fa-edit',
    //   type: 'edit',
    // },
    // {
    //   class: 'btn-outline-danger',
    //   text: null,
    //   font: 'fal fa-trash-alt',
    //   type: 'delete',
    // },
    // {
    //   class: 'btn-outline-success',
    //   text: null,
    //   font: 'fal fa-print',
    //   type: 'print',
    // },
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
      DisplayText: 'Purchase Date',
      ColumnName: 'purchaseDate',
      Type: 'date',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Qty',
      ColumnName: 'qty',
      Type: 'number',
      Is_Visible: true,
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Purchase Rate',
      ColumnName: 'purchaseRate',
      Type: 'number',
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Invoice No',
      ColumnName: 'invoiceNo',
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
    this.route.queryParams.subscribe((params) => {
      this.productId = +params['productId'];
      if (this.productId) {
        this.getProductPurchaseReport(this.productId);
      } else {
        this.toastr.error('Product ID not found in URL');
      }
    });
  }

  async getProductPurchaseReport(productId: number) {
    const res = await this.genericService.ExecuteAPI_Get<IResponse>(
      `PurchaseMaster/GetPurchaseReportByProduct/${productId}`
    );
    if (res.isSuccess) {
      this.purchaseReports = res.data;
      console.log(this.purchaseReports);
    } else {
      this.toastr.error('Failed to fetch purchase history');
    }
  }

  filterByDate() {
    if (!this.fromDate || !this.toDate) {
      this.toastr.warning('Please select both dates');
      return;
    }

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    // to.setHours(23, 59, 59, 999);

    this.purchaseReports = this.purchaseReports.filter((item) => {
      const purchaseDate = new Date(item.purchaseDate);
      return purchaseDate >= from && purchaseDate <= to;
    });
  }

  clearFilter() {
    this.fromDate = '';
    this.toDate = '';
    this.purchaseReports = [...this.purchaseReports];
  }

  // actionRow(RowItem: any) {
  //   if (RowItem.action === 'print') {
  //     const productId = RowItem.item.productId;

  //     this.router.navigate(['/report/printperitemstock'], {
  //       queryParams: { productId },
  //     });
  //   }
  // }

  goToReport() {
    if (!this.productId || this.productId === 0) {
      this.toastr.error('Product ID not found');
      return;
    }

    const queryParams: any = { productId: this.productId };

    if (this.fromDate) queryParams.fromDate = this.fromDate;
    if (this.toDate) queryParams.toDate = this.toDate;

    this.router.navigate(['/report/printperitemstock'], {
      queryParams,
    });
  }
}
