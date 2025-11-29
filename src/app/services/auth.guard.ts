
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { IUserDetail } from '../interfaces/user/user-detail';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private loginService: StoredDataService, private router: Router, private toastr: ToastrService, private jwtHelper: JwtHelperService,) {
    this.user = this.loginService.user$;
  }

  //added on 27-04
  user: any;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {


    const token = localStorage.getItem('smart_token');

    if (token) {
      let tokenValidity = this.jwtHelper.isTokenExpired(token);
      if (tokenValidity) {

        this.router.navigate(["/user/login"]);
        return;
      }

      return this.loginService.user$.pipe(
        map(auth => {


          if (auth) {


            if (auth.isActive == false) {
            //   console.log("isActive False");
            //   this.toastr.error("please activate the software")
            //   this.router.navigate(['/settings/school-profile'])

            // } else if (auth.isPasswordChanged == false) {
            //   console.log("isPasswordChanged False");
            //   this.toastr.error("please change the password")
            //   this.router.navigate(['/settings/change-password'])

            // }
            }
            else {
              return true;
            }


          }
          else {
            this.router.navigate(['user/login'], { queryParams: { returnUrl: state.url } });
          }

        })
      );
    }

  }
}
