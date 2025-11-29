import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from 'src/app/interfaces/response';
import { IEmployee } from 'src/app/interfaces/staf/staff';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-staff',
  templateUrl: './update-staff.component.html',
  styleUrls: ['./update-staff.component.css']
})
export class UpdateStaffComponent implements OnInit {
  employee: IEmployee;
  changeDateFormat: any;

  constructor(
    private genericService: GenericService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.bcService.set('@staffName', ' ');
    this.changeDateFormat = new ChangeDatePipe(this.datePipe);
  }

  ngOnInit(): void {
    this.bindData(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  async bindData(id: string) {
    const params = new HttpParams().set("id", id);
    const res = await this.genericService.ExecuteAPI_Get<IResponse>("Staff/GetOneEmployee", params);
    if (res.isSuccess) {
      this.employee = res.data;
      this.employee.joiningDate = this.datePipe.transform(this.employee.joiningDate, "dd MMM yyy");
      this.employee.dob = this.datePipe.transform(this.employee.dob, "dd MMM yyy");
    }
  }

  async updateStaff($event: IEmployee) {

    $event.joiningDate = this.changeDateFormat.transform($event.joiningDate);
    $event.dob = this.changeDateFormat.transform($event.dob);
    const res = await this.genericService.ExecuteAPI_Put<IResponse>("Staff/UpdateEmployee", $event);
    if (res) {
      this.employee = res;
      this.toastr.success("Staff data updated successfully.");
    } else {
      this.toastr.error("Failed to update staff data.");
    }
  }
}
