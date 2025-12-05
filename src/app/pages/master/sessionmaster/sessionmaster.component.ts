import { DatePipe } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/interfaces/response';
import { ISession } from 'src/app/interfaces/settings/session-interface';
import { YesNoPipe } from 'src/app/pipes/yes-no.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sessionmaster',
  templateUrl: './sessionmaster.component.html',
  styleUrl: './sessionmaster.component.css'
})
export class SessionmasterComponent  implements OnInit{
  session: ISession
  sessions: ISession[] = []
  sessionValues: any = {};

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private sharedService: SystemService,
    private datePipe: DatePipe,
    private genericService: GenericService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Name',
      ColumnName: 'name',
      Type: 'string',
      Is_Visible: true, Is_Sort: true
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Start Date',
      ColumnName: 'startDate',
      Type: 'date',
      Is_Visible: true, Is_Sort: true
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'End Date',
      ColumnName: 'endDate',
      Type: 'date',
      Is_Visible: true, Is_Sort: true
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Edit',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });
    this.sessions = [];
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


  txtSearch = '';
  totalRecords: number;
  action: string = 'new';
  buttonText: string = 'Submit';
  errors: string[];
  sessionForm: FormGroup;

  today = new Date();
    Url = environment.apiUrl;


  ngOnInit(): void {
    this.bindData();
    this.createSessionForm();
  }

  async bindData() {
    const filterPipe = new YesNoPipe();

    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'SessionMst/AllSessionList'
    );
    if (res) {
      this.sessions = res.data;
    }
  }

  createSessionForm() {
    this.sessionForm = this.fb.group({
      id: [
        0,
        [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      name: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
  }

  cancel(): void {
    this.sharedService.App.searchFilter.emit('');
    this.createSessionForm();
    this.today = new Date();
  }

  onSubmit(): void {
    if (this.action === 'edit') {
      this.editSession();
    } else {
      this.saveSession();
    }


  }

  pageChanged(obj: any) {}

  async editSession() {

    let startDate = new Date(this.sessionForm.controls.startDate.value);
    let endDate = new Date(this.sessionForm.controls.endDate.value);

    if (endDate > startDate) {

      this.sessionValues.Id = this.sessionForm.controls.id.value;
      this.sessionValues.Name = this.sessionForm.controls.name.value;
      this.sessionValues.StartDate = this.sessionForm.controls.startDate.value;
      this.sessionValues.EndDate = this.sessionForm.controls.endDate.value;

      this.genericService
        .post(this.Url + 'SessionMst/UpdateSession', this.sessionValues)
        .subscribe({
          next: (data) => {
            if (data.success == true) {
              this.toastrService.success('Success', data.message);
              this.bindData();
              this.createSessionForm();
            } else {
             this.toastrService.success('Success', data.message);
              this.bindData();
              this.createSessionForm();
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.createSessionForm();
      this.toastrService.error(
        'Failed',
        'End Date Should be grather than from Start Date'
      );
    }
  }


  async saveSession() {
    this.session = this.sessionForm.value;

    let startDate = new Date(this.sessionForm.controls.startDate.value);
    let endDate = new Date(this.sessionForm.controls.endDate.value);

    if (endDate > startDate) {
      let res = await this.genericService.ExecuteAPI_Post<IResponse>(
        'SessionMst/StartNewSession',
        this.session
      );
      if (res.isSuccess) {
        this.ngZone.run(() => {
          this.bindData();
          this.cancel();
          this.toastrService.success(res.message);
        });
      }
      else{
        this.toastrService.error(res.message);

      }
    }
  }

  actionRow(RowItem: any) {
    this.session = RowItem.item;
    this.session.startDate = this.datePipe.transform(
      this.session.startDate,
      environment.dateFormat
    );
    this.session.endDate = this.datePipe.transform(
      this.session.endDate,
      environment.dateFormat
    );
    this.action = RowItem.action;
    this.buttonText = 'Update';
    this.sessionForm.patchValue(this.session);
  }


}
