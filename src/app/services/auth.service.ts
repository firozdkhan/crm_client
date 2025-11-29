import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  checkLogin() {

    const token = localStorage.getItem('smart_token')

    if (token != null) {

      return true;
    }
    else {
      return false
    }

  }
}
