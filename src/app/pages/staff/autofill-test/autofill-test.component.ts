import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-autofill-test',
  templateUrl: './autofill-test.component.html'
})
export class AutofillTestComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  messageListener: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    // form create
    this.form = this.fb.group({
      studentName: [''],
      payMode: [''],
      totalAmount: [''],
      receiptNo: [''],
      remark: ['']
    });


    this.messageListener = (event: MessageEvent) => {
      if (event.data.type === 'SMARTSHIKSHA_AUTOFILL_DATA') {

        const data = event.data.payload;
        console.log("📩 Received from Tampermonkey:", data);


        this.form.patchValue({
          studentName: data.studentName,
          payMode: data.payMode,
          totalAmount: data.totalAmount,
          receiptNo: data.receiptNo,
          remark: data.remark
        });
      }
    };

    window.addEventListener("message", this.messageListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener("message", this.messageListener);
  }
}
