import { Component, Input, OnInit } from '@angular/core';
import { IPaidFees } from 'src/app/interfaces/fees/paid';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { IStudentSelect } from 'src/app/interfaces/student/student-select-interface';
import { GenericService } from 'src/app/services/generic.service.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fee-receipt',
  templateUrl: './fee-receipt.component.html',
  styleUrl: './fee-receipt.component.css',
})
export class FeeReceiptComponent implements OnInit {
  @Input() printReceiptDetails: IPaidFees;
  @Input() sId: number;
  @Input() student: IStudentSelect;
  filePath: string = environment.Base_File_Path;

  constructor(private genericService: GenericService) {}

  fileUrl: string = environment.Base_File_Path;
  directory: string = 'Images';
  profile: ISchoolProfile;
  schoolLogo: string = environment.imageIcon;
  studentImage: string = environment.imageIcon;
  logo: string;

  ngOnInit(): void {
    this.bindData();
    console.log(this.sId);
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPI_Get<ISchoolProfile>(
      'Core/GetCompanyProfile'
    );
    if (res as ISchoolProfile) {
      this.profile = res.data;
      if (this.profile.schoolLogo) {
        this.logo = this.fileUrl + res.data.schoolLogo;
        this.studentImage = this.fileUrl + this.student.imgPath;
      }
    }
  }
}
