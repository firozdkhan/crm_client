import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPurchaseMaster } from 'src/app/interfaces/Purchase/purchaseMaster';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';

@Component({
  selector: 'app-purchasegstreport',
  templateUrl: './purchasegstreport.component.html',
  styleUrl: './purchasegstreport.component.css',
})
export class PurchasegstreportComponent {
  fromDate: any = null;
  toDate: any = null;
  action: string = 'new';
  buttonText: string = 'Submit';
  today = new Date();
  actions: Action_Type[] = [
    {class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit',},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',},
    {class: 'btn-outline-success',text: null,font: 'fal fa-print',type: 'print',},];
  categories: any[];
  gridFilter: Array<GridFilter> = [];

  purchasemasters: IPurchaseMaster[] = [];

  constructor(private route: ActivatedRoute,private toastr: ToastrService,private genericService: GenericService,private router: Router) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Invoice No',ColumnName: 'invoiceNo',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Date',ColumnName: 'purchaseDate',Type: 'date',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Supplier Name',ColumnName: 'suppliersName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'GST No',ColumnName: 'supplierGst',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Total Amount',ColumnName: 'totalAmount',Type: 'number',Is_Visible: true,Is_Sum: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'CGST',ColumnName: 'cgst',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'SGST',ColumnName: 'sgst',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'IGST',ColumnName: 'igst',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'ToTal Tax',ColumnName: 'totalTaxAmount',Type: 'number',Is_Visible: true,Is_Sum: true,});

    this.categories = [];
  }

  ngOnInit(): void {
    this.GetPurchaseGSTData();
  }

  async GetPurchaseGSTData(fromDate?: string, toDate?: string) {
    let url = 'PurchaseGstReport/GetPurchaseGSTReportByDate';

    if (fromDate && toDate) {
      url += `?fromDate=${fromDate}&toDate=${toDate}`;
    }

    const res = await this.genericService.ExecuteAPI_Get<IResponse>(url);

    if (res.isSuccess) {
      this.purchasemasters = res.data;
      console.log(res.data);
    } else {
      this.toastr.warning(res.message || 'Data not found');
    }
  }

  async filterByDate() {
    if (!this.fromDate || !this.toDate) {
      this.toastr.warning('Please select both From and To date');
      return;
    }

    const from = this.formatDate(this.fromDate);
    const to = this.formatDate(this.toDate);

    await this.GetPurchaseGSTData(from, to);
  }

  async clearFilter() {
    this.fromDate = null;
    this.toDate = null;
    await this.GetPurchaseGSTData();
  }

  formatDate(date: any): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  pageChanged(event: any) {
    console.log('Page changed:', event);
  }
}
