import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-gender-dropdown',
  templateUrl: './gender-dropdown.component.html',
  styleUrls: ['./gender-dropdown.component.scss']
})
export class GenderDropdownComponent implements OnInit, ControlValueAccessor {
  @ViewChild('select', { static: true }) input: ElementRef;
  @Input() selectedValue: any;
  @Input() label = 'string';



  @Output("SelectChange") SelectChange: EventEmitter<any> = new EventEmitter<any>();

  dropwalut: any;

  genders = [
    { id: "male", name: 'Male' },
    { id: "female", name: 'Female' },
    { id: "other", name: 'Other' }
  ];

  constructor(@Optional() @Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;

  }

  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: Date;

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    control.setValidators(validators);
    control.updateValueAndValidity();
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



  public onValueChange(value: Event) {

    this.onChangeCallback(value);
    this.SelectChange.emit(value);

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

}

