import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { ISaleMaster } from 'src/app/interfaces/sales/saleMaster';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-printsaleinvoice',
  templateUrl: './printsaleinvoice.component.html',
  styleUrl: './printsaleinvoice.component.css',
})
export class PrintsaleinvoiceComponent {
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
  purchases: ISaleMaster[] = [];
  sale: ISaleMaster;
  currencyname: string = '';

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
    this.GetComapnyProfile();
  }

  async GetDataInvoice(invoiceNo: string) {
     
    if (!invoiceNo) {
      console.warn('Invoice number is missing.');
      return;
    }

    try {
      let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
        `SaleMasterApi/GetByInvoiceNo/${invoiceNo}`
      );

      if (res && res.isSuccess) {
        this.sale = res.data;
      } else {
        console.warn('API returned failure:', res.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  onEditInvoice() {
    this.router.navigate(['/sales/salemaster'], {
      queryParams: { invoiceNo: this.sale.invoiceNo },
    });
  }

  countryid: any;

  async GetComapnyProfile() {
     
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.countryId;
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
