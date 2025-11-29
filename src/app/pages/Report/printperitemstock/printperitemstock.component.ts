import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPurchaseReport } from 'src/app/interfaces/Report/purchaseitem';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';

@Component({
  selector: 'app-printperitemstock',
  templateUrl: './printperitemstock.component.html',
  styleUrl: './printperitemstock.component.css',
})
export class PrintperitemstockComponent {
  productId: number;
  purchaseReports: IPurchaseReport[] = [];
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
        this.getProductPurchaseReport(this.productId);
      } else {
        this.toastr.error('Product ID not found');
      }

      this.GetCompanyProfile();
    });
  }

  async getProductPurchaseReport(productId: number) {
    const res = await this.genericService.ExecuteAPI_Get<IResponse>(
      `PurchaseMaster/GetPurchaseReportByProduct/${productId}`
    );
    if (res.isSuccess) {
      this.purchaseReports = res.data;
      console.log(this.purchaseReports);
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
