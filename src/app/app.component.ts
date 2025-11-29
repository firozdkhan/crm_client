import { Component, OnInit } from '@angular/core';
import { StoredDataService } from './services/stored-data.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUserDetail } from './interfaces/user/user-detail';
import { TranslateService } from './translate/translate.service';
import { ILanguageFields } from './translate/languages-fields';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  /**
   *
   */
  constructor(
    private storedService: StoredDataService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.currentUser$ = this.storedService.user$;
  }
  languageData$: Observable<Array<ILanguageFields>>;
  currentUser$: Observable<IUserDetail>;

  title = 'smart-taleem';

  ngOnInit(): void {
    this.storedService.loadCityData();
    this.storedService.loadStateData();
    this.currentUser();

    if (localStorage.getItem('smart_token')) {
      // this.storedService.loadStudentSelectData();
      // this.loadLanguage();

      this.storedService.loadMiscData();
      this.storedService.loadCountryData();
      this.storedService.getSideMenu();
    }
  }
  // loadLanguage() {
  //   const languageId = +localStorage.getItem('languageId');

  //   this.storedService.getLanguageFields(languageId).subscribe(fields => {
  //     if (fields) {
  //       this.languageData$ = fields;
  //     }
  //   }, error => {
  //     console.log(error);
  //   });
  //   this.setLang("us");
  // }
  setLang(lang: string) {
    this.translate.use(lang);
  }

  currentUser() {
    const token = localStorage.getItem('smart_token');
    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.router.navigate(['/user/login']);
        return;
      }
      this.storedService.loadCurrentUser();
    }
  }
}
