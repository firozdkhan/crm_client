import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormGroupDirective, NgControl } from '@angular/forms';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer-buttons',
  templateUrl: './footer-buttons.component.html',
  styleUrls: ['./footer-buttons.component.scss']
})
export class FooterButtonsComponent implements OnInit {

  @Output("resetForm") resetForm: EventEmitter<any> = new EventEmitter<any>();
  @Input("buttonText") buttonText: string;
  @Input("isValid") isValid: boolean = true;

  constructor(private rootFormGroup: FormGroupDirective,
    private trans: TranslatePipe
  ) {

  }
  form: FormGroup;
  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: Date;

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
  }

  onChange(event) { }
  onTouched() { }

  writeValue(obj: any): void {

    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
  }



  public onValueChange(value) {
    this.onChangeCallback(value);
  }

  public reset() {
    this.resetForm.emit();
  }

  checkvalidation() {
    this.form = this.rootFormGroup.control;
    if (this.form.invalid) {
      Swal.fire(
        this.trans.transform('opps!'),
        this.trans.transform('Please check all required fields are fill properly.'),
        'error'
      );
      this.form.markAllAsTouched();
      return false;
    }

  }

}
