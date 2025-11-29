
import { map } from 'rxjs/operators';
import { Component, Input, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() serviceUrl: string = "Core/UploadFile";
  @Input() itemAlias: string = "";
  @Input() fileName: string = "Choose File";
  @Input() id: string = "";
  @Input() label: string = "";
  @Input() directory: string = "Temp";
  @Input() uploadProgress: number = 0;
  @Input() resetValue: boolean;
  @Input() accept: string = ".png, .jpg, .jpeg, .pdf"



  @Output() uploadResponse: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  file: any;
  type: string;
  apiurl: string;
  token = localStorage.getItem('smart_token');
  @ViewChild('labelImport')
  labelImport: ElementRef;
  baseUrl = environment.apiUrl;
  title = 'ng8fileupload';
  public uploader: FileUploader;


  ngOnChanges() {
    if (this.resetValue) {
      this.labelImport.nativeElement.innerText = "Choose File";
      this.uploader.progress = 0;
      this.resetValue = false;

    }
  }

  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: `${this.baseUrl + this.serviceUrl}?directory=${this.directory}`,
      itemAlias: this.itemAlias,
      headers: [{ name: 'Authorization', value: 'Bearer ' + this.token }]
    });
    this.uploadEvents();
    this.uploader.progress = this.uploadProgress;
  }

  uploadEvents() {
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('FileName', this.fileName);
      form.append('Directory', this.directory);
    };
    this.uploader.onProgressItem = (progress: any) => {
      console.log(progress['progress']);
    };


    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      let obj = JSON.parse(response);
      this.uploadResponse.emit(this.directory + '/' + obj.data);
    };
  }

  onFileSelected($event) {
    this.uploader.uploadAll();
    this.labelImport.nativeElement.innerText = $event.target.files[0].name
  }



}
