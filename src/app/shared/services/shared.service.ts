

import { IMenu } from './../interfaces/menu.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


import { IToastyMessage } from '../interfaces/toasty-message';
import { ToastrService } from 'ngx-toastr';
import { ILanguageFields } from 'src/app/translate/languages-fields';
import { IResponse } from 'src/app/interfaces/response';
import { ICity } from 'src/app/interfaces/dashboard/city';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  showToasty(arg0: { code: number; message: string; success: boolean; data: null; }) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,

  ) { }
  baseUrl = environment.apiUrl; 
  public refreshGrid: EventEmitter<any> = new EventEmitter();


  private menuSource = new BehaviorSubject<IMenu>(null);
  menu$ = this.menuSource.asObservable();

  private cityDataSource = new ReplaySubject<Array<ICity>>();
  cityData$ = this.cityDataSource.asObservable();


  private languageDataSource = new ReplaySubject<Array<ILanguageFields>>();
  languageData$ = this.languageDataSource.asObservable();





  getSideMenu(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Core/getSideMenu');
  }

  getLanguageFields(languageId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'SchoolSettings/GetLanguageFields?Id=' + languageId).pipe(
      map((fields: Array<ILanguageFields>) => {
        if (fields) {
          this.languageDataSource.next(fields);

        }
      })
    );
  }

  getMenu() {
    return this.http.get<IResponse>(this.baseUrl + 'core/getSideMenu');
  }






































}
