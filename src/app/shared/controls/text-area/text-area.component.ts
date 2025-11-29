import { Component, ElementRef, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() type = 'text';
  @Input() label = 'string';
  @Input() placeHolder:string;
  @Input() rows:number = 3;

  constructor(@Optional() @Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

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
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
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
