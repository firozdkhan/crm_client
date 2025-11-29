import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, map } from 'rxjs';

import { GenericService } from './generic.service.service';
import { IResponse } from '../interfaces/response';
import { ILoginRequest } from '../interfaces/user/login-request';
import { IUserDetail } from '../interfaces/user/user-detail';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IMenu } from '../interfaces/dashboard/menu';
import { IMisc } from '../interfaces/dashboard/misc';
import { ICity } from '../interfaces/dashboard/city';
import { ICommonValue } from '../interfaces/dashboard/common';
import { ILanguageFields } from '../interfaces/dashboard/language-fields';
import { environment } from 'src/environments/environment';

import { IProfile } from '../interfaces/profile';
import { IStudentSelect } from '../interfaces/student/student-select-interface';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StoredDataService {
  deleteRole(id: any) {
    throw new Error('Method not implemented.');
  }

  private userSource = new ReplaySubject<IUserDetail>(null);
  user$ = this.userSource.asObservable();

  private menuSource = new ReplaySubject<Array<IMenu>>(null);
  menu$ = this.menuSource.asObservable();

  private miscDataSource = new ReplaySubject<Array<IMisc>>();
  miscData$ = this.miscDataSource.asObservable();

  private cityDataSource = new ReplaySubject<Array<ICity>>();
  cityData$ = this.cityDataSource.asObservable();

  private stateDataSource = new ReplaySubject<Array<ICommonValue>>();
  stateData$ = this.stateDataSource.asObservable();

  private countryDataSource = new ReplaySubject<Array<ICommonValue>>();
  countryData$ = this.countryDataSource.asObservable();

  // private languageDataSource = new ReplaySubject<Array<ILanguageFields>>();
  // languageData$ = this.languageDataSource.asObservable();

  // private studentSelectDataSource = new ReplaySubject<Array<IStudentSelect>>();
  // studentSelectData$ = this.studentSelectDataSource.asObservable();

  constructor(
    private genericService: GenericService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {}

  baseApi = environment.apiUrl;
  sessionId = localStorage.getItem('smart_Sessionid');
  schoolId = localStorage.getItem('schoolId');

  async Loginuser(request: ILoginRequest) {
    let res = await this.genericService.ExecuteAPI_Post<IResponse>(
      'Core/LogIn',
      request
    );
    if (res.isSuccess) {
      // this.toastr.error("oops something error");
      localStorage.setItem('smart_token', res.data.token);
      localStorage.setItem('schoolId', res.data.schoolId);
      // localStorage.setItem('smart_Sessionid', res.data.sessionId);
      this.userSource.next(res.data);
      this.router.navigate(['/dashboard']);
    } else {
      this.toastr.error('oops something error');
    }
  }

  // loadCurrentUser(token: string): Observable<any> {
  //   if (token == null) {
  //     this.currentUserSource.next(null);
  //     return of(null);
  //   }
  //   if (this.jwtHelper.isTokenExpired(token)) {
  //     this.currentUserSource.next(null);
  //     return of(null);
  //   }

  //   return this.http.get<any>(this.baseUrl + 'Core/getCurrentUser').pipe(
  //     map((user: IUser) => {
  //       if (user) {
  //         user.token = token;

  //         this.currentUserSource.next(user);
  //       }
  //     })
  //   );
  // }

  async loadCurrentUser() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Core/GetCurrentUser'
    );
    if (res.isSuccess) {
      // localStorage.setItem('smart_token', res.data.token);

      this.userSource.next(res.data);
      // this.router.navigate(['/dashboard']);

      if (
        this.schoolId == null ||
        this.schoolId == undefined ||
        this.schoolId == ''
      ) {
        localStorage.clear();
        this.logout();
      }
    } else {
      this.toastr.error('oops something error');
    }
  }

  getMenu() {
    return this.http.get<IResponse>(this.baseApi + 'core/getSideMenu');
  }
  getSideMenu(): Observable<any> {
    return this.http.get<any>(this.baseApi + 'core/getSideMenu');
  }

  // getLanguageFields(languageId: number): Observable<any> {
  //   return this.http
  //     .get<any>(
  //       this.baseApi + 'SchoolSettings/GetLanguageFields?Id=' + languageId
  //     )
  //     .pipe(
  //       map((fields: IResponse) => {
  //         if (fields.isSuccess) {
  //           this.languageDataSource.next(fields.data);
  //         }
  //       })
  //     );
  // }

  async loadMiscData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'MasterMisc/GetMiscCategory'
    );
    if (res.isSuccess) {
      this.miscDataSource.next(res.data);
    } else {
      this.toastr.error(res.message);
    }
  }

  async loadCityData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Core/GetAllCity'
    );

    if (res.isSuccess) {
      this.cityDataSource.next(res.data);
    } else {
      this.toastr.error(res.message);
    }
  }

  async loadCountryData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'core/GetAllCountry'
    );
    if (res.isSuccess) {
      this.countryDataSource.next(res.data);
    } else {
      this.toastr.error(res.message);
    }
  }

  logout() {
    localStorage.removeItem('smart_token');
    this.userSource.next(null);
    this.router.navigateByUrl('/user/login');
  }

  async loadStateData() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'core/getStates'
    );
    if (res.isSuccess) {
      let data = res.data.map(
        (x) =>
          <ICommonValue>{
            id: x.id.toString(),
            name: x.name,
          }
      );
      this.stateDataSource.next(res.data);
    } else {
      this.toastr.error(res.message);
    }
  }

  // getProfile() {
  //   return this.http.get<IProfile>(this.baseApi + 'Core/getProfile');
  // }

  // async loadStudentSelectData() {
  //   let params = new HttpParams().set('sessionId', this.sessionId.toString());
  //   let res = await this.genericService.ExecuteAPI_Get<IResponse>(
  //     'Student/SessionStudent',
  //     params
  //   );
  //   if (res.isSuccess) {
  //     console.log(res.data);
  //     this.studentSelectDataSource.next(res.data);
  //   }
  // }
}
