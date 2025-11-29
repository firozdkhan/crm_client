import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IDocument } from 'src/app/interfaces/student/student-docs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-documents',
  templateUrl: './student-documents.component.html',
  styleUrl: './student-documents.component.css'
})
export class StudentDocumentsComponent implements OnInit {

  @Output() documentEvent = new EventEmitter<IDocument[]>()
  @Input() documentList: IDocument[] = [];
  @Input() sId: number = 0;
  @Input() resetValue: boolean;
  @Input() addNew: boolean;
  constructor(private toaster: ToastrService) {
  }


  miscCategory: ICategoryLabels = CategoryLabelData;
  uploadProgress: number;
  document = {} as IDocument;
  misc = {} as IMisc;
  fileUrl = environment.Base_File_Path;
  // resetValue : boolean = false;


  fileName: string = "Choose File";

  ngOnInit(): void {
  }
  setValue() {

    if (this.misc && this.document.fileUrl) {

      for (let i = 0; this.documentList.length > i; i++) {
        if (this.documentList[i].documentId === this.document.documentId) {
          this.toaster.error("Document alredy exists !!");
          return;
        }
      }
      this.document.sId = this.sId;
      this.documentList.push(this.document);
      this.documentEvent.emit(this.documentList);
      this.document = {} as IDocument;
      this.misc = {} as IMisc;
      if (this.fileName === "Choose File ") {
        this.fileName = "Choose File";
      } else {
        this.fileName = "Choose File";
      }

    }
    else {
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
    this.document.fileUrl = $event;
    // this.uploadProgress = 0;
    this.resetValue = false;
  }
  selectDocumentText($event: string) {

    this.document.documentName = $event;
  }


}

