import { Component, ElementRef, EventEmitter, forwardRef, Injector, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']

})
export class DatePickerComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() type = 'text';
  @Input() value: Date = new Date();
  @Input() label = 'string';
  @Input() isDisabled: boolean = false;
  // @Input() isLabelVisible: boolean = true;
  @Input() dateFormat: string = environment.datePickerFormat;

  @Input() maxDate: Date;

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
    control.setValue(this.value);


    if (this.maxDate == null) {
      this.maxDate = new Date();
      this.maxDate.setDate(this.maxDate.getDate());
    }

  }

  onChange(event) { }
  onTouched() { }

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
    // this.DateChange.emit(value);
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
