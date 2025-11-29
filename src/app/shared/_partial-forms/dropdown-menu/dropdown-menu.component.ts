import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ILanguages } from 'src/app/translate/languages';
import { ILanguageFields } from 'src/app/translate/languages-fields';
import { environment } from 'src/environments/environment';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { GenericService } from 'src/app/services/generic.service.service';
import { TranslateService } from 'src/app/translate/translate.service';
import { IUserDetail } from 'src/app/interfaces/user/user-detail';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';




@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})

export class DropdownMenuComponent implements OnInit {


  constructor(
    private storedData: StoredDataService,
    private genericService: GenericService,
    private translate: TranslateService,
    private toastr: ToastrService


  ) { }
  currentUser$: Observable<IUserDetail>;
  languageData$: Observable<ILanguageFields>;
  languages: ILanguages[] = [];
  languageId: number = 1;
  photoPath: string = environment.Base_API_URL;

  ngOnInit() {
    this.currentUser$ = this.storedData.user$;
    // this.getlanguage();
    this.languageId = + localStorage.getItem('languageId');
  }

  // async getlanguage() {

  //   let res = await this.genericService.ExecuteAPI_Get<IResponse>("SchoolSettings/GetLanguages")
  //   if (res.isSuccess) {

  //     this.languages = res.data;


  //   }
  // }

  onLogOut() {
    this.storedData.logout();
    this.toastr.success('Success', 'Logged out successfully');
  }


 

  setLang(lang: string) {
    this.translate.use(lang);
    window.location.reload();
  }

}
