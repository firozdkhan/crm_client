import { Component, OnInit } from '@angular/core';
import { IProfile } from 'src/app/interfaces/profile';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-info-card',
  templateUrl: './nav-info-card.component.html',
  styleUrls: ['./nav-info-card.component.scss'],
})
export class NavInfoCardComponent implements OnInit {
  constructor(
    private storedData: StoredDataService,
    private genericService: GenericService
  ) {}

  profile: ISchoolProfile;
  fileUrl: string = environment.Base_File_Path;
  logo: string;

  ngOnInit() {
    this.getMenus();
  }

  async getMenus() {
    let res = await this.genericService.ExecuteAPI_Get<ISchoolProfile>(
      'Core/GetCompanyProfile'
    );

    if (res as ISchoolProfile) {
      this.profile = res;

      if (this.profile.schoolLogo) {
        this.logo = this.fileUrl + res.data.schoolLogo;
      }
    }
    // this.storedData.getProfile().subscribe(response => {
    //   this.profile = response;
    //   this.profile.logo = this.fileUrl + this.profile.logo;

    //   }, error => {
    //     console.log(error);
    //   }
    //   );
    // }
  }
}
