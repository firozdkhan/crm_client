
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';



@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(

      catchError(error => {

        if (error) {

          if (error.status === 400) {

            if (error.error.message) {

              this.toastr.error("Opps", error.error.message);

              //throw error.error;

            }
            else {

              this.toastr.error("Opps", error.error);

            }
          }

          if (error.status === 401) {

            this.toastr.error(error.error.message, "opps");

          }

          if (error.status === 409) {

            this.toastr.error(error.error.message, "opps");

          }

          if (error.status === 404) {
            this.router.navigateByUrl('/not-found');
          }

          if (error.status === 500) {
            const navigationExtras: NavigationExtras = {
              state: { error: error.error }
            };
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }

        return throwError(error);
      })
    );

  }


}
