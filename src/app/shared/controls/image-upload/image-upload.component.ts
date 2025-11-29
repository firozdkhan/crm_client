import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
})
export class ImageUploadComponent implements OnInit, OnChanges {
  @Input() serviceUrl: string = 'Core/UploadFile';
  @Input() itemAlias: string = '';
  @Input('imageUrl') imageUrl: string = '';

  @Input() fileName: string = 'Choose Photo';
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() directory: string = '';

  @Output() uploadResponse: EventEmitter<string> = new EventEmitter<string>();

  constructor(public sanitizer: DomSanitizer) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl']) {
      this.imageUrl = changes['imageUrl'].currentValue;
    }
  }

  file: any;
  type: string;
  apiurl: string;
  token = localStorage.getItem('smart_token');

  baseUrl = environment.apiUrl;
  fileUrl = environment.Base_File_Path;

  public uploader: FileUploader;

  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: `${this.baseUrl + this.serviceUrl}?directory=${this.directory}`,
      itemAlias: this.itemAlias,
      headers: [{ name: 'Authorization', value: 'Bearer ' + this.token }],
    });

    this.uploadEvents();
  }

  uploadEvents() {
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('FileName', this.fileName);
      form.append('Directory', this.directory);
    };

    this.uploader.onProgressItem = (progress: any) => {
      console.log(progress['progress']);
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
      let url = window.URL
        ? window.URL.createObjectURL(fileItem._file)
        : (window as any).webkitURL.createObjectURL(fileItem._file);
      this.imageUrl = url;
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      let obj = JSON.parse(response);
      this.uploader.progress = 0;
      this.uploadResponse.emit(obj.data);
      this.imageUrl = this.fileUrl + obj.data;
    };
  }
  onFileSelected() {
    this.uploader.uploadAll();
  }

  resetValue() {
    this.imageUrl = environment.studentProfileImage;
    this.uploadResponse.emit(null);
    this.uploader.progress = 0;
  }
}
