import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ICurrency } from 'src/app/interfaces/configuration/currency';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { ISession } from 'src/app/interfaces/settings/session-interface';
import { IStudentSelect } from 'src/app/interfaces/student/student-select-interface';
import { IUserDetail } from 'src/app/interfaces/user/user-detail';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
  sessions: ISession[] = [];
  sessionName: string = '';
  currentUser$: Observable<IUserDetail>;
  photoPath: string = environment.Base_API_URL;
  sId: number = 0;
  src: string;
  tooltip: string;
  profile: ISchoolProfile;
  packageId: string;
  photoUrl: string;

  currencys: ICurrency[] = [];
  currency: ICurrency;

  constructor(
    private storeData: StoredDataService,
    private router: Router,
    private genric: GenericService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.storeData.user$;
    // this.bindData();
    this.schoolProfile();
    this.loadCurency();
  }

  onSelectChange($event: IStudentSelect) {
    if ($event) {
      this.router.navigate(['/student/student-detail/' + $event.id]);
    }
  }

  // async bindData() {
  //   let res = await this.genric.ExecuteAPI_Get<Response>(
  //     'SchoolSettings/GetAllSessions'
  //   );
  //   if (res.isSuccess) {
  //     this.sessions = res.data.map((x) => ({
  //       active: x.active,
  //       startDate: x.startDate,
  //       id: x.id,
  //       endDate: x.endDate,
  //       name: x.name,
  //     }));

  //     if (this.sessions.length > 0) {
  //       this.sessionName = this.sessions[0].name;
  //     }
  //   }
  // }

  async schoolProfile() {
    let res = await this.genric.ExecuteAPI_Get<ISchoolProfile>(
      'Core/GetCompanyProfile'
    );
    if (res as ISchoolProfile) {
      this.profile = res.data;
    }
  }

  changeSession(item: ISession) {
    this.sessionName = item.name;
  }

  // Just test //
  selectedCurrency: string = '₹';

  currencies = [
    { symbol: '₹' },
    { symbol: '$' },
    { symbol: '€' },
    { symbol: '£' },
    { symbol: '¥' },
  ];

  //// Currency Call use Api ////
  async loadCurency() {
    let res = await this.genric.ExecuteAPI_Get<IResponse>(
      'CurrencyApi/GetAllCurrency'
    );
    if (res.isSuccess) {
      this.currencies = res.data;
    }
  }
}
