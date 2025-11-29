import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IItemStock } from 'src/app/interfaces/Report/ItemStock';
import { IPurchaseReport } from 'src/app/interfaces/Report/purchaseitem';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-itemstock',
  templateUrl: './itemstock.component.html',
  styleUrl: './itemstock.component.css',
})
export class ItemstockComponent {
  ItemStock: IItemStock;
  ItemStocks: IItemStock[] = [];
  categories: any[];
  action: string = 'new';
  today = new Date();
  gridFilter: Array<GridFilter> = [];
  purchaseReports: IPurchaseReport[] = [];
  showPurchaseReport = false;
  selectedProductId: number | null = null;
  selectedProductName: string = '';
  actions: Action_Type[] = [
    {class: 'btn-outline-success',text: null,font: 'fas fa-cart-arrow-down',type: 'purchase',tooltip :'Item Purchase Report'},
    {class: 'btn-outline-success',text: null,font: 'fas fa-shipping-fast',type: 'sale', tooltip :'Print'},
  ];

  constructor(private fb: FormBuilder,private systemService: SystemService,private genericSErvice: GenericService,private trans: TranslatePipe,
    private toastr: ToastrService,private router: Router) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Product Name',ColumnName: 'productName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Product Rate',ColumnName: 'productRate',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Product Qty',ColumnName: 'productQty',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Balance',ColumnName: 'balance',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Sale Rate',ColumnName: 'saleRate',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Sale Qty',ColumnName: 'saleQty',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Sale Balance',ColumnName: 'saleBalance',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Remaning Stock',ColumnName: 'remaningStock',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Remaning Stock Price',ColumnName: 'remaingStockPrice',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Edit',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});
    this.categories = [];
  }

  ngOnInit(): void {
    this.GetItemStock();
  }

  async GetItemStock() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>('StockItem/GetAllItemStock');
    if (res.isSuccess) {
      this.ItemStocks = res.data;
      console.log(this.ItemStock);
    }
  }
  async getProductPurchaseReport(productId: number) {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(`PurchaseMaster/GetPurchaseReportByProduct/${productId}`);
    if (res.isSuccess) {
      this.purchaseReports = res.data;
      this.showPurchaseReport = true;
    } else {
      this.toastr.error('Failed to fetch purchase history');
    }
  }

  async getProductSaleReport(productId: number) {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      `PurchaseMaster/GetSaleReportByProduct/${productId}`
    );
    if (res.isSuccess) {
      this.purchaseReports = res.data;
      this.showPurchaseReport = true;
    } else {
      this.toastr.error('Failed to fetch purchase history');
    }
  }

  actionRow(RowItem: any) {
     
    if (RowItem.action === 'purchase') {
      // this.selectedProductId = RowItem.item.productId;
      // this.selectedProductName = RowItem.item.productName;
      this.getProductPurchaseReport(RowItem.item.productId);

      this.router.navigate(['/report/peritemstock'], {
        queryParams: { productId: RowItem.item.productId },
      });
    }
    if (RowItem.action == 'sale') {
      this.getProductSaleReport(RowItem.item.productId);

      this.router.navigate(['/report/saleperitemstock'], {
        queryParams: { productId: RowItem.item.productId },
      });
    }
  }

  closeReportModal() {
    this.showPurchaseReport = false;
    this.purchaseReports = [];
    this.selectedProductId = null;
  }
}
