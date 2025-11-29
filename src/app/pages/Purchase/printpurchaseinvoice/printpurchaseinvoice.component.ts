import { environment } from 'src/environments/environment';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPurchaseMaster } from 'src/app/interfaces/Purchase/purchaseMaster';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-printpurchaseinvoice',
  templateUrl: './printpurchaseinvoice.component.html',
  styleUrl: './printpurchaseinvoice.component.css',
})
export class PrintpurchaseinvoiceComponent {
  Base_File_Path = environment.Base_File_Path;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService,
    private router: Router
  ) {}
  juned: any;
  purchases: IPurchaseMaster[] = [];
  purchase: IPurchaseMaster;
  companyprofile: ISchoolProfile;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const invoiceNo = params['invoiceNo'];
      if (invoiceNo) {
        this.GetDataInvoice(invoiceNo);
      } else {
        console.warn('invoiceNo query param missing');
      }
    });
    this.loadCompanyProfile();
  }

  async GetDataInvoice(invoiceNo: string) {
    if (!invoiceNo) {
      console.warn('Invoice number is missing.');
      return;
    }

    try {
      let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
        `PurchaseMaster/GetByInvoiceNo/${invoiceNo}`
      );

      if (res && res.isSuccess) {
        this.purchase = res.data;
        console.log(res.data);
      } else {
        console.warn('API returned failure:', res.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  onEditInvoice() {
    this.router.navigate(['/purchase/addpurchase'], {
      queryParams: { invoiceNo: this.purchase.invoiceNo },
    });
  }

  /////// test ////////////////////
  countryid: any;
  currencyname: string = '';

  async loadCompanyProfile() {
     
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.regionId;
      this.companyprofile = res;
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
