import { Injectable } from '@angular/core';
import { StoredDataService } from '../services/stored-data.service';
import { Observable } from 'rxjs';
import { ILanguageFields } from './languages-fields';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {



  data: any = {};

  constructor(

    private storedData: StoredDataService

  ) {
    // this.languageData$ = this.storedData.languageData$;
  }

  languageData$: Observable<Array<ILanguageFields>>;

  use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      // const langPath = `assets/languages/${lang || 'en'}.json`;
      // this.http.get<{}>(langPath).subscribe(
      this.languageData$.subscribe(
        translation => {
          console.log(translation);
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
          console.log(this.data);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );




    });
  }
}
