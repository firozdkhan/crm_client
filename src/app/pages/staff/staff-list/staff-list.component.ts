import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IEmployee } from 'src/app/interfaces/staf/staff';
import { GenericService } from 'src/app/services/generic.service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent implements OnInit {

  constructor(
    private genericService: GenericService
  ) { }

  fileUrl = environment.Base_File_Path;
  query: string;

  staffList: IEmployee[];
  ngOnInit(): void {
    this.bindData();
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>("Staff/GetAllEmployee");
    if (res) {

      this.staffList = res.data;

    }
  }

}
