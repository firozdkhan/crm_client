import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-only-date',
  templateUrl: './only-date.component.html',
  styleUrl: './only-date.component.css'
})
export class OnlyDateComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() type = 'text';
  @Input() value: Date = new Date();
  @Input() label = 'string';
  @Input() isDisabled: boolean = false;
  @Input() isLabelVisible: boolean = true;
  @Input() dateFormat: string = environment.datePickerFormat;

  @Output("DateChange") DateChange: EventEmitter<any> = new EventEmitter<any>();

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
    this.DateChange.emit(value);
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
