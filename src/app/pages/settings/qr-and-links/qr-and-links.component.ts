import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { IDocument } from 'src/app/interfaces/student/student-docs';
import { GenericService } from 'src/app/services/generic.service.service';
import { DateValidatorService } from 'src/app/shared/services/date-validator.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { WINDOW } from '../../models/windowProvider';

@Component({
  selector: 'app-qr-and-links',
  templateUrl: './qr-and-links.component.html',
  styleUrls: ['./qr-and-links.component.css']
})
export class QrAndLinksComponent implements OnInit {
  linkForm: FormGroup;
  inquiryForm: string;
  feedbackForm: string;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericService,
    private sharedService: SharedService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private dateValidator: DateValidatorService,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit(): void {
    this.createLinkForm();
    this.loadlinks();
  }

  createLinkForm() {
    this.linkForm = this.fb.group({
      inquiryLink: [''],
      feedbackLink: ['']
    });
  }

  loadlinks() {
    let domain = this.window.location.href.substring(0, this.window.location.href.length - 22)
    this.inquiryForm = domain + "/user/online-inquiry";
    this.feedbackForm = domain + "/user/feedback-form";

  }
  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      this.toastrService.success('Link copied to clipboard!');
    }).catch(err => {
      this.toastrService.error('Failed to copy the link.');
    });
  }
}
