import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IClassFeesDetails } from 'src/app/interfaces/fees/class-detail';
import { IResponse } from 'src/app/interfaces/response';
import { IUploadStaffData } from 'src/app/interfaces/staf/upload-attendnace';
import { IApplystudent } from 'src/app/interfaces/student/applystudent';
import { IUploadData } from 'src/app/interfaces/student/upload-data';
import { GenericService } from 'src/app/services/generic.service.service';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-attendnace',
  templateUrl: './upload-attendnace.component.html',
  styleUrl: './upload-attendnace.component.css'
})
export class UploadAttendnaceComponent implements OnInit, OnChanges {
  @Output() documentEvent = new EventEmitter<IUploadData[]>()
  @Input('documentList') documentList: IUploadData[] = [];
  @Input() sId: number = 0;
  @Input("buttonText") buttonText: string = "Upload";

  uploadProgress: number;
  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private genericService: GenericService,
    private route: ActivatedRoute,

  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.documentList) {


      if (this.documentList.length == 0) {
        this.uploadProgress = null;
      }
      console.log(this.documentList.length);
      console.log(changes);
    }
  }


  gridFilter: Array<GridFilter> = [];

  actions: Action_Type[] = [
    { class: 'btn-outline-success', text: null, font: 'fal fa-address-card', type: 'view', tooltip: "View student profile" },
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit', tooltip: "Edit Student" },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete', tooltip: "Delete Student" },
  ];

  document = {} as IUploadData;
  miscCategory: ICategoryLabels = CategoryLabelData;
  students: IApplystudent[] = [];
  student: IApplystudent;
  studentsSubscription: Subscription
  action: string = "new";
  classId: string;
  sectionId: string;
  studentList: IClassFeesDetails[];
  totalRecords: number;
  myForm: FormGroup;
  uploadFields: IUploadStaffData[] = [];
  uploadField: IUploadStaffData;
  uploadfileName: string;
  misc = {} as IMisc;
  fileUrl = environment.Base_File_Path;
  resetValue: boolean;


  fileName: string = "Choose File";

  ngOnInit(): void {

  }

  // async OnSubmit() {
  //   const result = await Swal.fire({
  //     title: 'Please be aware...',
  //     text: 'You will not be able to recover this data!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, Upload it!',
  //     cancelButtonText: 'No, keep it',
  //   });

  //   if (result.isConfirmed) {
  //     let checkNull = this.uploadFields.filter(x =>
  //       !x.No || !x.TMNo || !x.Mode || !x.EnNo || !x.Name || !x.GMN || !x.In_Out || !x.Antipass || !x.ProxyWork || !x.DateTime
  //     );
  //     if (checkNull.length > 0) {
  //       this.toastrService.error("Please fill the required fields marked in red");
  //       return;
  //     }

  //     const saveResponse = await this.genericService.ExecuteAPI_Post<IResponse>("StaffUploadFiles/UploadTextFile", this.uploadFields);
  //     if (saveResponse && saveResponse.success) {

  //       debugger
  //       const fileUploadResponse = await this.genericService.ExecuteAPI_Post<IResponse>("StaffUploadFiles/UploadTextFile", this.uploadFields);
  //       if (fileUploadResponse && fileUploadResponse.success) {
  //         this.toastrService.success("Data has been uploaded successfully!");
  //         this.uploadFields = [];
  //       } else {
  //         this.toastrService.error("Error in uploading the text file.");
  //       }
  //     } else {
  //       this.toastrService.error("Error in saving the staff data.");
  //     }
  //   }
  // }

  async OnSubmit() {
    const result = await Swal.fire({
      title: 'Please be aware that if you upload data through this data sheet, it will overwrite and erase all manually entered data in the software. Ensure that you have saved or backed up any important information before proceeding with the upload. We are not responsible for any loss of data due to this action.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Upload it!',
      cancelButtonText: 'No, keep it',
    });

    if (!result.isConfirmed) {
      return;
    }
    debugger
    let checkNull = this.uploadFields.filter(x =>
      x.no == null || x.tmNo == null || x.enNo == null ||
      x.name == null || x.gmn == null || x.mode == null ||
      x.in_Out == null || x.antipass == null ||
      x.proxyWork == null || x.dateTime == null
    );
    if (checkNull.length > 0) {
      this.toastrService.error("Please fill the required fields which is mark red");
      return;
    }

    debugger
    let res = await this.genericService.ExecuteAPI_Post<IResponse>("StaffUploadFiles/SaveTextFileData", this.uploadFields);
    if (res) {
      this.toastrService.success("Data has been uploaded successfully !!");
      this.uploadFields = [];
    } else {
      this.toastrService.error("Failed to save data to database");
    }

  }



  async setValue() {
    let params = new HttpParams().set("filePath", this.uploadfileName);
    try {
      const res = await this.genericService.ExecuteAPI_Get<IResponse>("StaffUploadFiles/DisplayFileContentAsTable", params);
      if (res && res.data) {
        this.uploadFields = res.data;
        console.log(this.uploadFields);
      } else {

      }
    } catch (error) {

    }
  }

  reset() {

  }
  studentDocumentUploadResponse($event: string) {

    this.uploadfileName = $event;
    this.uploadProgress = 0;
    this.resetValue = null;
  }
  pageChanged(obj: any) { }

  actionRow(RowItem: any) {
    this.action = RowItem.action;
    // if (this.action === "view") {
    //   this.student = RowItem.item;
    //   this.router.navigateByUrl('/student/student-detail/' + this.student.id);
    // }
    // else if (this.action === "edit") {
    //   this.student = RowItem.item;
    //   this.router.navigateByUrl('/student/update-student/' + this.student.id);
    // }
    // else if (this.action === "delete") {
    //   let res = this.genericService.ExecuteAPI_Post<IResponse>("Student/DeleteStudent", RowItem.item.id);
    //   this.toastrService.success("Student Record Deleted Successfully");
    //   this.OnSubmit();
    // }
  }
}


