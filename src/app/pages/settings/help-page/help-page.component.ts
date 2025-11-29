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
import { IToastyMessage } from 'src/app/shared/interfaces/toasty-message';
import {
  GridFilter,
  Action_Type,
  Badge_Type,
} from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css',
})
export class HelpPageComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    public datepipe: DatePipe,
    private systemService: SystemService,
    private genericService: GenericService,
    private trans: TranslatePipe
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
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
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
  sessionId = localStorage.getItem('sessionId');
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
  tokenNumber: string;

  async ngOnInit() {
    this.myDateValue = new Date();
    this.createHelpForm();
    await this.schoolProfile();
    this.bindData();
    this.cancel();
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
    let params = new HttpParams()
      .set('schoolName', this.schoolName)
      .set('schoolCode', this.schoolCode);
    let res = await this.genericService.ExecuteAPIFullURL_Get<IHelpPage[]>(
      'https://master.dzabsoft.com/api/QueryTableApi/GetSpecificSchoolQueryies',
      params
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

  onSubmit(): void {
    if (this.action === 'edit') {
      this.editUploads();
    } else {
      this.saveUploads();
    }

    this.action = 'new';
    this.buttonText = 'Submit';
  }

  pageChanged(obj: any) {}

  async editUploads() {
    this.help = this.helpForm.value;
  
    this.help.schoolName = this.profile.name;
    // this.help.uploadDate = this.changeDateformat.transform(this.help.);
    let res = await this.genericService.ExecuteAPIFullUrl_Put<IToastyMessage>(
      'https://master.dzabsoft.com/api/QueryTableApi/UpdateQuery',
      this.help
    );

    if (res) {
      this.bindData();
      // this.sharedService.showToasty(res);
      this.toastrService.success('Data has been Update !!');
      this.cancel();
      this.fileUrl = '';
      this.helpForm.controls['fileUrl'].setValue(null);
    }
  }

  async saveUploads() {
    this.help = this.helpForm.value;
 
    this.help.schoolName = this.profile.name;
    let res = await this.genericService.ExecuteAPIFullUrl_Post<IToastyMessage>(
      'https://master.dzabsoft.com/api/QueryTableApi/AddQuery',
      this.help
    );
    if (res) {
      this.help = res.data;
      this.tokenNumber = this.help.tokenNumber;
      this.ngZone.run(() => {
        this.bindData();
        this.toastrService.success('Complaint Raised Successfully !!');
        let param = new HttpParams().set('tokenNumber', this.tokenNumber);
        this.genericService.ExecuteAPI_Get<IToastyMessage>(
          'Core/SendTokenMessage',
          param
        );
        this.cancel();
        this.fileUrl = '';
        this.helpForm.controls['fileUrl'].setValue(null);
      });
    }
  }

  deleteMenu(misc: number) {
    Swal.fire({
      title: this.trans.transform('Are you sure?'),
      text: this.trans.transform('You will not be able to recover this data !'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.trans.transform('Yes, delete it!'),
      cancelButtonText: this.trans.transform('No, keep it'),
    }).then((result) => {
      if (result.isConfirmed) {
        let param = new HttpParams().set('id', this.help.id.toString());
        let res = this.genericService.ExecuteAPIFullUrl_Delete(
          'https://master.dzabsoft.com/api/QueryTableApi/DeleteQuery',
          param
        );
        if (res) {
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your data has been deleted.'),
            'success'
          );
          this.bindData();
          this.cancel();
        }
      }
    });
  }

  actionRow(RowItem: any) {
    this.help = RowItem.item;
    this.action = RowItem.action;
    if (this.action === 'delete') {
      this.deleteMenu(this.help.id);
    } else {
      this.getsingleData(this.help.id);
      this.buttonText = 'Update';
    }
  }

  async getsingleData(id: any) {
    let params = new HttpParams().set('id', id);
    let res = await this.genericService.ExecuteAPIFullURL_Get<IHelpPage[]>(
      'https://master.dzabsoft.com/api/QueryTableApi/GetSingleQuery',
      params
    );
    if (res) {
      this.help = res.data;
      this.helpForm.patchValue(this.help);
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
