
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
//Start Alert Service

import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Observable, firstValueFrom } from 'rxjs';

//End Alert Service
//import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

export interface Parameters {
  url: string;
  parameterObject?: any;
}

const NewhttpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root',
})


export class GenericService {
  fetchStudentFeesData() {
    throw new Error('Method not implemented.');
  }
  public httpOptions = { headers: new HttpHeaders() };

  SetHttpOptions() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      }),
    };
  }

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.SetHttpOptions();
  }



  ExecuteAPIFullURL_Get<T>(action: string, params: any = {}): Promise<any> {

    return firstValueFrom(
      this.http.get<T>(action, { params: params }).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {

          // this.toastrService.error(err.error.message);
          throw err;
        })
      )
    );
  }
  ExecuteAPI_Get<T>(action: string, params: any = {}): Promise<any> {
    action = environment.apiUrl + action;
    return firstValueFrom(
      this.http.get<T>(action, { params: params }).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {

          // this.toastrService.error(err.error.message);
          throw err;
        })
      )
    );
  }

  ExecuteAPI_Post<T>(action: string, params: any = {}): Promise<any> {
    let url = environment.apiUrl + action;
    //return this.http.post<any>(url, params, httpOptions).toPromise<any>();
    return firstValueFrom(
      this.http.post<T>(url, params, this.httpOptions).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {

          // this.toastrService.error(err.error.message);
          throw err;
        })
      )
    );
  }

  ExecuteAPI_Put<T>(action: string, params: any = {}): Promise<any> {
    let url = environment.apiUrl + action;
    //return this.http.post<any>(url, params, httpOptions).toPromise<any>();
    return firstValueFrom(
      this.http.put<T>(url, params, this.httpOptions).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {

          // this.toastrService.error(err.error.message);
          throw err;
        })
      )
    );
  }

  ExecuteAPI_Delete<T>(action: string, params: any = {}): Promise<T> {
    action = environment.apiUrl + action;
    //return this.http.get<T>(action).toPromise<T>();
    return firstValueFrom(
      this.http.delete<T>(action, { params: params }).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {

          // this.toastrService.error(err.error.message);
          throw err;
        })
      )
    );
  }


  ExecuteAPIFullUrl_Post<T>(action: string, params: any = {}): Promise<any> {
    let url = action;
    return firstValueFrom(
      this.http.post<T>(url, params, this.httpOptions).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {

          // this.toastrService.error(err.error.message);
          throw err;
        })
      )
    );
  }

  ExecuteAPIFullUrl_Put<T>(action: string, params: any = {}): Promise<any> {
    let url = action;
    //return this.http.post<any>(url, params, httpOptions).toPromise<any>();
    return firstValueFrom(
      this.http.put<T>(url, params, this.httpOptions).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {
          // this.toastrService.error(err);
          throw err;
        })
      )
    );
  }

  ExecuteAPIFullUrl_Delete<T>(action: string, params: any = {}): Promise<T> {
    action = action;
    //return this.http.get<T>(action).toPromise<T>();
    return firstValueFrom(
      this.http.delete<T>(action, { params: params }).pipe(
        map((data: any) => data as T),
        catchError((err, caught) => {
          //this.toastrService.error(err);
          throw err;
        })
      )
    );
  }

  public post(url: string, parameterObject?: any): Observable<any> {
    console.log('paramobject values', parameterObject)
    return this.http.post(url, parameterObject, NewhttpOptions);
  }

}
