import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service.service';
import { environment } from 'src/environments/environment';
import { IResponse } from 'src/app/interfaces/response';
import { IEmployee } from 'src/app/interfaces/staf/staff';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
})
export class StaffListComponent implements OnInit {
  fileUrl = environment.Base_File_Path;
  query: string;
  staffList: IEmployee[] = [];

  currentPage = 1;
  itemsPerPage = 10;

  get paginatedStaffList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    return this.staffList.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.staffList.length / this.itemsPerPage);
  }

  constructor(private genericService: GenericService) { }

  ngOnInit(): void {
    this.bindData();
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>('Staff/GetStaffContact');
    if (res.isSuccess) {
      this.staffList = res.data;
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
