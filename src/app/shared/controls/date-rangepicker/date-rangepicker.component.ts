import { Component, ElementRef, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-date-rangepicker',
  templateUrl: './date-rangepicker.component.html',
  styleUrls: ['./date-rangepicker.component.scss']
})
export class DateRangepickerComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() type = 'text';
  @Input() value : string ;
  @Input() label = 'string';
  @Input() isDisabled:boolean = false;

  constructor(@Optional() @Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};


  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  onChange(event) {}
  onTouched() {}

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
    // this.value = obj;
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
  get validator() {
    if (this.controlDir.control.validator) {
      const validator = this.controlDir.control.validator({} as AbstractControl);
      
      if (validator) {

        if (validator.required) {
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

}
