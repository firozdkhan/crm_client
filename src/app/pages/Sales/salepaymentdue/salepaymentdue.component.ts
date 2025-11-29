import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { ISaleMaster } from 'src/app/interfaces/sales/saleMaster';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-salepaymentdue',
  templateUrl: './salepaymentdue.component.html',
  styleUrls: ['./salepaymentdue.component.css']
})
export class SalepaymentdueComponent {

  salepayment: ISaleMaster[] = [];

  today: Date = new Date();
  action: string = 'new';
  buttonText: string = 'Submit';
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
    {
      class: 'btn-outline-success',
      text: null,
      font: 'fas fa-info-circle',
      type: 'navigate',
      tooltip :'Pay Now',
    },
  ];
  categories: any[];
  gridFilter: Array<GridFilter> = [];



  constructor(
    private fb: FormBuilder,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe
  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Invoice no', ColumnName: 'invoiceNo', Type: 'string', Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Customer Name',ColumnName: 'customerName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Sale Date',ColumnName: 'purchaseDate',Type: 'date',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: ' Reference',ColumnName: 'purchaseInvoiceNumber',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Total Amount',ColumnName: 'totalAmount',Type: 'number',Is_Visible: true,Is_Sum :true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Grand Total',ColumnName: 'grandtotal',Type: 'number',Is_Visible: true,Is_Sum :true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Pay Amount',ColumnName: 'payAmount',Type: 'number',Is_Visible: true, Is_Sum :true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Balance Due',ColumnName: 'balanceDue',Type: 'number',Is_Visible: true, Is_Sum :true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Edit', ColumnName: 'Action', Type: 'string',Actions: this.actions,Is_Visible: true});
    this.categories = [];
  }



  ngOnInit(): void {

    this.loadpurchsebalancedue();
  }

async loadpurchsebalancedue(){

 let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>('SaleMasterApi/GetSalees_BalanceDue')

 if(res){
 this.salepayment = res.data;
 }


}

actionRow(RowItem: any) {
   
  const selectedRow: ISaleMaster = RowItem.item;
  this.action = RowItem.action;

  if (this.action === 'navigate') {
    this.buttonText = 'navigate';
    this.router.navigate(['/accounting/receiptvoucher'], {
      queryParams: { id: selectedRow.id },
    });
  }
}


}
