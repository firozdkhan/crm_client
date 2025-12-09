import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IClientVisit } from 'src/app/interfaces/mis/client-visit';
import { IStockPosting } from 'src/app/interfaces/Report/stockposting';
import { IResponse } from 'src/app/interfaces/response';
import { ICustomer } from 'src/app/interfaces/sales/Customer';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visit-reports',
  templateUrl: './visit-reports.component.html',
  styleUrl: './visit-reports.component.css'
})
export class VisitReportsComponent {
  fromDate: any = null;
  toDate: any = null;

  productId: number;
  stockposting: IClientVisit[] = [];

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
    this.gridFilter.push(<GridFilter>{DisplayText: 'Type', ColumnName: 'followType', Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Date', ColumnName: 'date', Type: 'date',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Name', ColumnName: 'name', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'PinCode', ColumnName: 'pincode', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Phone', ColumnName: 'phoneNo', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Address', ColumnName: 'address', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Remarks', ColumnName: 'remarks', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'FollowUp Date', ColumnName: 'followUpDate', Type: 'date',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Visits', ColumnName: 'visitCount', Type: 'number',  Is_Visible: true, Is_Sum:true  });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });
    

     

     
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

     
    

    const res = await this.genericService.ExecuteAPI_Get<IResponse>('Geo/VisitReports',parems);
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
