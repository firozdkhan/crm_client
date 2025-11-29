import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { YesNoPipe } from 'src/app/pipes/yes-no.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';

import { SharedService } from 'src/app/shared/services/shared.service';
import { ILanguages } from 'src/app/translate/languages';
import { ILanguageFields } from 'src/app/translate/languages-fields';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrl: './language.component.css',
})
export class LanguageComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private genericService: GenericService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Language',
      ColumnName: 'languages',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Title',
      ColumnName: 'title',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Value',
      ColumnName: 'value',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Edit',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });
    this.fields = [];
  }

  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    {
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
    },
  ];

  lang: ILanguages;
  fields: ILanguageFields[] = [];
  field: ILanguageFields;
  languages: ICommonValue[];
  txtSearch = '';
  totalRecords: number;
  action: string = 'new';
  buttonText: string = 'Submit';
  errors: string[];
  fieldForm: FormGroup;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const languageId = params['id'];
      if (languageId) {
        this.bindData(languageId);
      } else {
        // Default language id can be set here if needed
        // this.bindData('1');
      }
    });
    this.createFieldForm();
  }

  async bindData(languageId: string) {
    const filterPipe = new YesNoPipe();
    let params = new HttpParams().set('id', languageId);
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'SchoolSettings/ShowLanguageFields',
      params
    );
    if (res.isSuccess) {
      this.fields = res.data;
    }

    let ress = await this.genericService.ExecuteAPI_Get<Array<IResponse>>(
      'SchoolSettings/GetLanguages'
    );
    if (ress.isSuccess) {
      this.languages = ress.data.map(
        (x) =>
          <ICommonValue>{
            id: x.id.toString(),
            name: x.name,
          }
      );
    }
  }

  changeLanguage(languageId: any) {
    if (languageId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { id: languageId },
        queryParamsHandling: 'merge',
      });
    }
  }

  createFieldForm() {
    this.fieldForm = this.fb.group({
      id: [0, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      languageId: [null, Validators.required],
      title: [null, Validators.required],
      value: [null, Validators.required],
    });
  }

  cancel(): void {
    this.createFieldForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  onSubmit(): void {
    if (this.action === 'edit') {
      this.editField();
    } else {
      this.saveField();
    }

    this.action = 'new';
    this.buttonText = 'Submit';
    this.bindData(this.field.languageId.toString());
  }

  pageChanged(obj: any) {}

  async editField() {
    this.field = this.fieldForm.value;
    let res = await this.genericService.ExecuteAPI_Put<IResponse>(
      'SchoolSettings/UpdateLanguageFields',
      this.field
    );
    if (res.isSuccess) {
      this.field = res.data;
      this.cancel();
      this.fieldForm.patchValue({
        languageId: this.field.languageId.toString(),
      });
    }
  }

  async saveField() {
    this.field = this.fieldForm.value;
    let res = await this.genericService.ExecuteAPI_Post<IResponse>(
      'SchoolSettings/AddLanguageFields',
      this.field
    );
    if (res) {
      this.toastr.success('Data has been saved');
      this.field = res.data;
      this.cancel();
      this.fieldForm.patchValue({
        languageId: this.field.languageId.toString(),
      });
    }
  }

  actionRow(RowItem: any) {
    this.field = RowItem.item;
    this.field.languageId = this.field.languageId;
    this.action = RowItem.action;
    this.buttonText = 'Update';
    this.fieldForm.patchValue(this.field);
  }
}
