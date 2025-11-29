import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IHelpPage } from 'src/app/interfaces/settings/help-page';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import {
  GridFilter,
  Action_Type,
  Badge_Type,
} from 'src/app/shared/models/common_model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-help-report',
  templateUrl: './help-report.component.html',
  styleUrl: './help-report.component.css',
})
export class HelpReportComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    public datepipe: DatePipe,
    private sharedService: SharedService,
    private systemService: SystemService,
    private genericService: GenericService
  ) {
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Token Number',
      ColumnName: 'tokenNumber',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'School Name',
      ColumnName: 'schoolName',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'School Code',
      ColumnName: 'schoolCode',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Subject',
      ColumnName: 'subject',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Description',
      ColumnName: 'description',
      Type: 'string',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Attachment',
      ColumnName: 'attachment',
      Type: 'attechment',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Date',
      ColumnName: 'date',
      Type: 'date',
      Is_Visible: true,
      Is_Sort: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Status',
      ColumnName: 'status',
      Type: 'badge',
      Badges: this.badges,
      Is_Visible: true,
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Edit',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });
    // this.miscData$ = this.sharedService.miscData$;
    this.changeDateformat = new ChangeDatePipe(this.datepipe);
  }

  miscData$: Observable<Array<IMisc>>;
  classData: Array<ICommonValue>;
  sectionData: Array<ICommonValue>;

  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    {
      class: 'btn-outline-success',
      text: null,
      font: 'ni ni-close',
      type: 'resolved',
    },
  ];

  badges: Badge_Type[] = [
    { text: 'Resolved', condition: 'success' },
    { text: 'Pending', condition: 'danger' },
  ];

  fileUrl: string;
  helpsss: IHelpPage[] = [];
  help: IHelpPage;
  classes: ICommonValue[];
  classId: number;
  selectedCar: number;
  sectionId: number;
  subscription: Subscription;
  sessionId = localStorage.getItem('smart_Sessionidv');
  dueDate: string;
  resetValue: boolean = false;
  changeDateformat: any;
  profile: ISchoolProfile;
  txtSearch = '';
  totalRecords: number;
  action: string = 'new';
  buttonText: string = 'Submit';
  errors: string[];
  helpForm: FormGroup;
  checked: boolean = true;
  forStudent: boolean = false;
  myDateValue: Date;
  miscCategory: ICategoryLabels = CategoryLabelData;
  today = new Date();
  schoolName: string;
  schoolCode: string;

  async ngOnInit() {
    this.myDateValue = new Date();
    this.createHelpForm();
    await this.schoolProfile();
    this.bindData();
  }

  async schoolProfile() {
    let res = await this.genericService.ExecuteAPI_Get<ISchoolProfile>(
      'Core/GetCompanyProfile'
    );
    if (res as ISchoolProfile) {
      this.profile = res.data;
      this.schoolName = this.profile.name;
   
    }
  }

  async bindData() {
    let res = await this.genericService.ExecuteAPIFullURL_Get<IHelpPage[]>(
      'https://master.dzabsoft.com/api/QueryTableApi/GetAllQueryies'
    );
    if (res) {
      this.helpsss = res.data;
    }
  }

  createHelpForm() {
    this.helpForm = this.fb.group({
      id: [
        0,
        [Validators.nullValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      subject: [null, [Validators.required]],
      description: [null, [Validators.required]],
      attachment: [null],
    });
  }

  cancel(): void {
    this.resetValue = true;
    this.systemService.App.searchFilter.emit('');
    this.createHelpForm();
    this.today = new Date();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  onSubmit(): void {}

  pageChanged(obj: any) {}

  actionRow(RowItem: any) {
    this.help = RowItem.item;
    this.action = RowItem.action;
    if (this.action === 'resolved') {
      this.updateStatus(this.help.id);
    }
  }

  async updateStatus(id: any) {
    let params = new HttpParams().set('id', id);
    let res = await this.genericService.ExecuteAPIFullURL_Get<IHelpPage[]>(
      'https://master.dzabsoft.com/api/QueryTableApi/UpdateQueryStatus',
      params
    );
    if (res) {
      
      this.help = res.data;
      this.toastrService.success('Status Updated Successfully !!');
      this.genericService.ExecuteAPI_Get<IHelpPage>(
        'Core/IssueResolevedMessage'
      );
      this.bindData();
      // this.helpForm.patchValue( this.help);
    }
  }

  public changed(e: any): void {
    if (e != '') {
      this.systemService.App.searchFilter.emit(this.txtSearch);
    }
  }
  changeSwitch(value: boolean) {
    this.checked = value;
  }
  changeForStudent(value: boolean) {
    this.forStudent = value;
  }

  DocumentUploadResponse($event: string) {
    this.fileUrl = $event;
    this.helpForm.controls['attachment'].setValue($event);
    this.resetValue = false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public classValueChange($event: Array<string>) {
    console.log($event);
    $event.forEach((element) => {
      if (element === '0') {
        const selected = this.classData.map((item) => item.id);
        this.helpForm.get('classIds').patchValue(selected);
      }
    });
  }

  public sectionValueChange($event: Array<string>) {
    console.log($event);
    $event.forEach((element) => {
      if (element === '0') {
        const selected = this.sectionData.map((item) => item.id);
        this.helpForm.get('sectionIds').patchValue(selected);
      }
    });
  }
}
