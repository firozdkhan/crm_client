import { KeyValue } from './../../models/common_model';
import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() type = 'text';
  @Input() label = 'string';
  @Input() placeHolder: string;
  @Input() isDisabled: boolean = false;
  @Input() inputValue: string = null;
  @Input() readOnly: boolean = false;

  @Input() maxLength: number = 50;

  constructor(@Optional() @Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }
  isreq: boolean;
  isOldPasswordVisible: boolean = false;
  @Output("TextChange") TextChange: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
    control.addValidators([Validators.minLength(1), Validators.maxLength(this.maxLength)]);


  }

  public noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length ? null : { 'whitespace': true };
  }

  onChange(event) {

  }

  onTouched() {

  }
  valuechange(newValue) {

    this.TextChange.emit(newValue);
  }

  writeValue(obj: any): void {

    this.input.nativeElement.value = obj || "";





  }

  registerOnChange(fn: any): void {
    this.onChange = fn;


  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;


  }

  focusOutFunction(event: any) {


    // this.input.nativeElement.value = " " ? null : this.inputValue;

    // this.inputValue = this.input.nativeElement.value;



    // console.log(this.input.nativeElement.value);
    // console.log(this.inputValue)

  }

  get validator() {
    if (this.controlDir.control.validator) {
      const validator = this.controlDir.control.validator({} as AbstractControl);

      if (validator) {

        if (validator.required) {
          //  this.controlDir.control.addValidators([this.noWhitespaceValidator]);
          return true;
        }
        else { return false }
      }
      else {
        return false
      }
    }
    else {
      return false
    }


  }

  toggleVisibility() {

    if (this.type == 'password') {
      this.type = "text";
    }
    else { this.type = "password"; }




  }

}
