import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPaymentVoucher } from 'src/app/interfaces/accounting/paymentvoucher';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-printpaymentvoucher',
  templateUrl: './printpaymentvoucher.component.html',
  styleUrl: './printpaymentvoucher.component.css',
})
export class PrintpaymentvoucherComponent {
  voucherId: number;
  paymentVoucherData: IPaymentVoucher;
  Base_File_Path = environment.Base_File_Path;
  companyprofile: ISchoolProfile;

  constructor(private route: ActivatedRoute,private http: HttpClient,private fb: FormBuilder,private systemService: SystemService,private genericSErvice: GenericService,
    private trans: TranslatePipe,private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.voucherId = +params['Id'];
      if (this.voucherId) {
        this.getVoucherById(this.voucherId);
      }
    });
    this.loadCompanyProfile();
  }

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

  async getVoucherById(id: number) {
     
    let res = await this.genericSErvice.ExecuteAPI_Get<IPaymentVoucher>(
      `PaymentVoucher/GetPaymentVoucherById?id=${id}`
    );

    if (res.isSuccess) {
      this.paymentVoucherData = res.data;
      console.log('Payment Voucher:', this.paymentVoucherData);
    } else {
      console.error('Failed to load payment voucher:', res.message);
    }
  }
}
