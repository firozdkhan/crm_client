import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
  token: string;

  constructor(private jwtHelper: JwtHelperService, private router:Router) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    this.token = localStorage.getItem('smart_token');

    if (this.token) {
      if (this.jwtHelper.isTokenExpired(this.token)) {
        this.router.navigate(["/login"]);
      }


      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      });
      req.headers.append('Content-Type', 'application/xml');
      req.headers.append('Access-Control-Allow-Origin', '*');
      req.headers.append('Access-Control-Allow-Methods', '*');
      req.headers.append('Access-Control-Allow-Headers', '*');

    }

    return next.handle(req);

  }
 
}
