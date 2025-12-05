import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPurchaseMaster } from 'src/app/interfaces/Purchase/purchaseMaster';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchaseinvoiceview',
  templateUrl: './purchaseinvoiceview.component.html',
  styleUrl: './purchaseinvoiceview.component.css',
})
export class PurchaseinvoiceviewComponent {
  purchases: IPurchaseMaster[] = [];
  purchase: IPurchaseMaster;
  today: Date = new Date();
  action: string = 'new';
  buttonText: string = 'Submit';
  actions: Action_Type[] = [
    {class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit', tooltip :'Edit'},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',tooltip :'Delete' },
    {class: 'btn-outline-success',text: null,font: 'fal fa-print',type: 'print',tooltip :'Print'},
  ];
  categories: any[];
  gridFilter: Array<GridFilter> = [];

  constructor(
    private fb: FormBuilder, private genericSErvice: GenericService,private trans: TranslatePipe, private toastr: ToastrService, private router: Router
  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Invoice no',ColumnName: 'invoiceNo',Type: 'string', Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Supplier Name',ColumnName: 'suppliersName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Purchase Date',ColumnName: 'purchaseDate',Type: 'date',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: ' Reference',ColumnName: 'purchaseInvoiceNumber',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Total Amount', CurrencyName: 'INR',ColumnName: 'totalAmount',Type: 'number',Is_Price: true,Is_Visible: true, Is_Sum  :true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Grand Totla',ColumnName: 'grandtotal',Type: 'number',Is_Visible: true, Is_Sum  :true});

    this.gridFilter.push(<GridFilter>{DisplayText: 'Pay Amount', ColumnName: 'payAmount', Type: 'number',Is_Visible: true,Is_Sum  :true });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Balance Due',ColumnName: 'balanceDue',Type: 'number',Is_Visible: true, Is_Sum  :true});

    this.gridFilter.push(<GridFilter>{ DisplayText: 'Edit',ColumnName: 'Action',Type: 'string', Actions: this.actions, Is_Visible: true, });

    this.categories = [];
  }

  ngOnInit(): void {
    this.GetPurchaseMasterData();
    this.loadCompanyProfile();
  }

  async GetPurchaseMasterData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IPurchaseMaster>(
      'PurchaseMaster/GetAllPurchase'
    );
    if (res.data) {
      this.purchases = res.data;
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
          'PurchaseMaster/DeletePurchase',
          params
        );
        if (res && res) {
          this.purchases = this.purchases.filter(
            (category) => category.id !== miscId
          );
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
     
    this.purchase = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.purchase.id);
    } else if (this.action === 'edit') {
      this.buttonText = 'edit';
      this.router.navigate(['/purchase/addpurchase'], {
        queryParams: { invoiceNo: this.purchase.invoiceNo },
      });
      console.log(this.purchase);
    } else if (this.action === 'print') {
      this.buttonText = 'Print';
      this.router.navigate(['/purchase/printpurchaseinvoice'], {
        queryParams: { invoiceNo: this.purchase.invoiceNo },
      });
      console.log(this.purchase);
    }
  }

  /////// test ////////////////////
  countryid: any;
  currencyname: string = '';

  async loadCompanyProfile() {
     
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.countryId;

      this.getCountryById(this.countryid);
    }
  }

  async getCountryById(id: number) {
    let response = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      `Core/GetCountryById/${id}`
    );

    if (response.isSuccess) {
      this.currencyname = response.data.currency;
      console.log(this.currencyname);
    }
  }
}
