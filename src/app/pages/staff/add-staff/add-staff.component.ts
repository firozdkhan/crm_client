import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { IEmployee } from 'src/app/interfaces/staf/staff';
import { GenericService } from 'src/app/services/generic.service.service';


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css'
})
export class AddStaffComponent implements OnInit {

  constructor(
    private genericSErvice: GenericService,
    private toaster: ToastrService
  ) {

  }

  reset: boolean = false;
  ngOnInit(): void {

  }
  async saveStaff($event: IEmployee) {

    let res = await this.genericSErvice.ExecuteAPI_Post<IResponse>("Staff/AddNewEmployee", $event);
    if (res) {

      this.toaster.success(res.message);
    }
    else {
      this.toaster.error(res.message);
    }
  }

  resetDocumentList() {
    this.reset = !this.reset;
  }

}



