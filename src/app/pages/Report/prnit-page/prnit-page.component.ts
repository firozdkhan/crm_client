
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from 'src/app/interfaces/response';
import { ISalary } from 'src/app/interfaces/staf/salary';
import { GenericService } from 'src/app/services/generic.service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prnit-page',
  templateUrl: './prnit-page.component.html',
  styleUrls: ['./prnit-page.component.css'],
})
export class PrnitPageComponent implements OnInit {
  salaryDetails: ISalary;
  netPayInWords: string;
  currentMonth: string;
  currentYear: number = new Date().getFullYear();
  baseFilePath: string = environment.Base_File_Path;
  slipId: any;

  monthsList: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  constructor(private genericService: GenericService,
    private route: ActivatedRoute,

  ) {

  }

  ngOnInit(): void {
    this.currentMonth = new Date().toLocaleString('default', { month: 'long' });
    this.slipId = this.route.snapshot.paramMap.get('id');
    this.loadStaffSalaryDetails(this.slipId);
  }

  async loadStaffSalaryDetails(slipId) {
    let param = new HttpParams().set("id", slipId)
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("StaffSalary/Get_UpdateStaffSalary_ById", param)
    if (res.isSuccess) {
      this.salaryDetails = res.data;
    }
  }
}
