import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-custom-switch',
  templateUrl: './custom-switch.component.html',
  styleUrls: ['./custom-switch.component.scss']
})
export class CustomSwitchComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() checked: boolean = false;
  @Input() checkString ="";
  @Input() label = 'string';
  @Input() formControlId: string;
  @Output("ChangeSwitch") changeSwitch: EventEmitter<any> = new EventEmitter<any>();


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

  onChange(event) {}
  onTouched() {}

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
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
    this.changeSwitch.emit(value);
  }

}
