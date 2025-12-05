import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ILeaveMaster } from 'src/app/interfaces/master/leavemaster';
import { IResponse } from 'src/app/interfaces/response';
import { YesNoPipe } from 'src/app/pipes/yes-no.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leavemaster',
  templateUrl: './leavemaster.component.html',
  styleUrl: './leavemaster.component.css'
})
export class LeavemasterComponent implements OnInit {
  leavemaster: ILeaveMaster
  leavemasterss: ILeaveMaster[] = []
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
      ColumnName: 'leave',
      Type: 'string',
      Is_Visible: true, Is_Sort: true
    });
    this.gridFilter.push(<GridFilter>{
      DisplayText: 'No Of Days',
      ColumnName: 'leaveDays',
      Type: 'number',
      Is_Visible: true, Is_Sort: true
    });

    this.gridFilter.push(<GridFilter>{
      DisplayText: 'Edit',
      ColumnName: 'Action',
      Type: 'string',
      Actions: this.actions,
      Is_Visible: true,
    });
    this.leavemasterss = [];
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
  LeaveForm: FormGroup;

  today = new Date();
  Url = environment.apiUrl;


  ngOnInit(): void {
    this.bindData();
    this.createSessionForm();
  }

  async bindData() {
    const filterPipe = new YesNoPipe();

    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'LeaveMaster/GetAllLeave'
    );
    if (res) {
      this.leavemasterss = res.data;
    }
  }
public changed(e: any): void {


    
  }
  createSessionForm() {
    this.LeaveForm = this.fb.group({
      id: [0, [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      leaveId: [null, [Validators.required]],
      leaveDays: [null, [Validators.required]],
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

  pageChanged(obj: any) { }

async editSession() {
  debugger;
  this.sessionValues = this.LeaveForm.value;
  this.sessionValues.leaveDays = Number(this.sessionValues.leaveDays);

  try {
    const data = await this.genericService.ExecuteAPI_Put(
      'LeaveMaster/UpdateLeaveMaster',
      this.sessionValues
    );

    if (data.isSuccess) {
      this.toastrService.success('Success', data.message);
      this.bindData();
      this.createSessionForm();
    } else {
      this.toastrService.error('Error', data.message);
    }
  } catch (err) {
    console.error(err);
    this.toastrService.error('Error', 'Something went wrong while updating');
  }
}

  async saveSession() {
    this.leavemaster = this.LeaveForm.value;

    if (this.leavemaster) {
      let res = await this.genericService.ExecuteAPI_Post<IResponse>(
        'LeaveMaster/AddNewLeaveMaster',
        this.leavemaster
      );
      if (res.isSuccess) {
        this.ngZone.run(() => {
          this.bindData();
          this.cancel();
          this.toastrService.success(res.message);
        });
      } else {
        this.toastrService.error(res.message);
      }
    }
  }



  async deleteData(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        let res = await this.genericService.ExecuteAPI_Delete<IResponse>(`LeaveMaster/DeleteLeaveMaster?id=${id}`);
        if (res.isSuccess) {
          Swal.fire('Deleted!', 'Leave has been deleted.', 'success');
          this.bindData();
        }
      } catch (error) {

      }
    }
  }

  actionRow(RowItem: any) {
    debugger;
    this.leavemaster = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteData(this.leavemaster.id);
    }
    else {

      this.buttonText = "Update";
      this.LeaveForm.patchValue(this.leavemaster);

    }
  }

}
