import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISaleReport } from 'src/app/interfaces/Report/saleitemreport';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';

@Component({
  selector: 'app-saleperitemstock',
  templateUrl: './saleperitemstock.component.html',
  styleUrl: './saleperitemstock.component.css',
})
export class SaleperitemstockComponent {
  productId: number;
  salereport: ISaleReport[] = [];
  schoolprofile: ISchoolProfile;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private genericService: GenericService,
    private router: Router
  ) {}

  ngOnInit(): void {
     
    this.route.queryParams.subscribe((params) => {
      this.productId = +params['productId'];
      if (this.productId) {
        this.getProductSaleReport(this.productId);
      } else {
        this.toastr.error('Product ID not found');
      }

      this.GetCompanyProfile();
    });
  }

  async getProductSaleReport(productId: number) {
    const res = await this.genericService.ExecuteAPI_Get<IResponse>(
      `SaleMasterApi/GetSaleReportByProduct/${productId}`
    );
    if (res.isSuccess) {
      this.salereport = res.data;
      console.log(this.salereport);
    } else {
      this.toastr.error('Failed to fetch purchase history');
    }
  }

  async GetCompanyProfile() {
     
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );
    if (res) {
      this.schoolprofile = res;
    }
  }
  print() {
    window.print();
  }
}
