import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISaleMaster } from 'src/app/interfaces/sales/saleMaster';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saleinvoiceview',
  templateUrl: './saleinvoiceview.component.html',
  styleUrl: './saleinvoiceview.component.css',
})
export class SaleinvoiceviewComponent {
  sales: ISaleMaster[] = [];
  sale: ISaleMaster;
  today: Date = new Date();
  action: string = 'new';
  buttonText: string = 'Submit';
  actions: Action_Type[] = [
    {class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit', tooltip :'Edit'},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',tooltip :'Delete'},
    {class: 'btn-outline-success',text: null,font: 'fal fa-print',type: 'print', tooltip :'Print'},
  ];
  categories: any[];
  gridFilter: Array<GridFilter> = [];

  constructor(private fb: FormBuilder,private genericSErvice: GenericService,private trans: TranslatePipe,private toastr: ToastrService, private router: Router
  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Invoice no', ColumnName: 'invoiceNo', Type: 'string', Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Customer Name',ColumnName: 'customerName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Sale Date',ColumnName: 'purchaseDate',Type: 'date',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Reference',ColumnName: 'purchaseInvoiceNumber',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Total Amount',ColumnName: 'totalAmount',Type: 'number',Is_Visible: true, Is_Sum:true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Grand Total',ColumnName: 'grandtotal',Type: 'number',Is_Visible: true, Is_Sum:true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Pay Amount',ColumnName: 'payAmount',Type: 'number',Is_Visible: true, Is_Sum:true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Balance Due',ColumnName: 'balanceDue',Type: 'number',Is_Visible: true, Is_Sum:true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Edit', ColumnName: 'Action', Type: 'string',Actions: this.actions,Is_Visible: true,});
    this.categories = [];
  }

  ngOnInit(): void {
    this.GetPurchaseMasterData();
  }

  async GetPurchaseMasterData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<ISaleMaster>(
      'SaleMasterApi/GetAllSales'
    );
    if (res.data) {
      this.sales = res.data;
    }
  }

  async deleteMenu(miscId: number) {
     
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set('id', miscId.toString());
        let res = await this.genericSErvice.ExecuteAPI_Delete(
          'SaleMasterApi/DeleteSale',
          params
        );
        if (res && res) {
          this.sales = this.sales.filter((category) => category.id !== miscId);
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your record has been deleted.'),
            'success'
          );
        } else {
          this.toastr.error('Failed to delete record');
        }
      }
    });
  }

  actionRow(RowItem: any) {
     
    this.sale = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.sale.id);
    } else if (this.action === 'edit') {
      this.buttonText = 'edit';
      this.router.navigate(['/sales/salemaster'], {
        queryParams: { invoiceNo: this.sale.invoiceNo },
      });
      console.log(this.sale);
    } else if (this.action === 'print') {
      this.buttonText = 'Print';
      this.router.navigate(['/sales/printsaleinvoice'], {
        queryParams: { invoiceNo: this.sale.invoiceNo },
      });
      console.log(this.sale);
    }
  }
}
