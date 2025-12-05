import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IEmployee } from 'src/app/interfaces/staf/staff';
import { GenericService } from 'src/app/services/generic.service.service';
import { environment } from 'src/environments/environment';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrl: './staff-details.component.css'
})
export class StaffDetailsComponent implements OnInit {

  constructor(
    private bcService: BreadcrumbService,
    private activatedRoute: ActivatedRoute,
    private genericService: GenericService,
    private toaster: ToastrService
  ) {
    this.bcService.set('@staffName', ' ');
  }

  id: string;
  employee: IEmployee;
  fileUrl = environment.Base_File_Path;

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.bindData(this.id);
  }

  async bindData(id) {
    let params = new HttpParams().set("id", id);
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Staff/GetOneEmployee", params);
    if (res.isSuccess) {
      this.employee = res.data;
      // this.bcService.set('@staffName', this.employee.name);

    }

  }

}
