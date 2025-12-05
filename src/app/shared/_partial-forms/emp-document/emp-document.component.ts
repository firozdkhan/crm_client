import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IEmployeeDoc } from 'src/app/interfaces/staf/staff';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-emp-document',
  templateUrl: './emp-document.component.html',
  styleUrls: ['./emp-document.component.scss']
})
export class EmpDocumentComponent implements OnInit {

  @Output() documentEvent = new EventEmitter<IEmployeeDoc[]>()
  @Input() documentList: IEmployeeDoc[] = [];
  @Input() resetValue: boolean;

  constructor(private toaster: ToastrService) { }

  miscCategory: ICategoryLabels = CategoryLabelData;
  document = {} as IEmployeeDoc;
  misc = {} as IMisc;
  fileUrl: string = environment.Base_File_Path;
  fileName: string = "Choose File";

  ngOnInit(): void {
  } setValue() {

    if (this.misc && this.document.filePath) {

      for (let i = 0; this.documentList.length > i; i++) {
        if (this.documentList[i].documentId === this.document.documentId) {
          this.toaster.error("Document alredy exists !!");
          return;
        }
      }
    }

    if (this.document.documentName && this.document.filePath) {
      this.documentList.push(this.document);
      this.documentEvent.emit(this.documentList);
      this.document = {} as IEmployeeDoc;
      this.misc = {} as IMisc;
      this.fileName = "Choose File";
    } else {
      this.toaster.error("Please fill proper data");
    }
    this.resetValue = true;
  }
  removeValue(index) {

    this.documentList.splice(index, 1);
    this.documentEvent.emit(this.documentList);
  }
  selectDocument($event: number) {
    this.document.documentId = $event;
    this.resetValue = true;
  }

  studentDocumentUploadResponse($event: string) {
    this.document.filePath = $event;
    this.resetValue = false;
  }
  selectDocumentText($event: string) {
    this.document.documentName = $event;
  }
  // Add this function to clear/reset the document list
  clearDocumentList() {
    this.documentList = [];
  }
  resetDocumentList() {
    this.documentList = [];
    this.documentEvent.emit(this.documentList);
  }
}
