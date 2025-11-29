import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService {

  constructor(private auth: AuthService, private toastr: ToastrService, private router: Router) { }

  canActivate(): boolean {

    if (this.auth.checkLogin() == false) {
      this.toastr.error('you are not authorized to see this page', 'Unauthorized');
      this.router.navigate(['/', 'login']);
      return false
    }
    else {
      return true;
    }
  }
}
