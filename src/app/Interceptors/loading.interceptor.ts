import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Observable, delay, finalize } from 'rxjs';

@Injectable()

export class loadingInterceptor implements HttpInterceptor {
  /**
   *
   */
  constructor(private spinner :NgxSpinnerService) {
     
    
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  this.busy();

    
  return next.handle(req).pipe(
    delay(0),
    finalize(() => {
      this.idle();
    })
  );


  }

  
  
  busy() {
        this.spinner.show();
  }

  idle() {
      
      this.spinner.hide();
    
  }

}


