import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, AbstractControl } from '@angular/forms';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';



@Component({
  selector: 'app-employee-dropdown',
  templateUrl: './employee-dropdown.component.html',
  styleUrls: ['./employee-dropdown.component.scss']
})
export class EmployeeDropdownComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild('select', { static: true }) input: ElementRef;
  @Input() selectedValue: any;

  @Input() label = 'string';
  @Input() multiple = false;
  @Input() addAll: boolean = false;

  @Output("SelectChange") SelectChange: EventEmitter<any> = new EventEmitter<any>();


  constructor(@Optional() @Self() public controlDir: NgControl, private genericService: GenericService) {
    this.controlDir.valueAccessor = this;


  }
  dropwalut: any;
  allValue: ICommonValue = { id: "0", name: "All" }

  selectValues: ICommonValue[] = [];
  data: ICommonValue[];


  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: Date;
  ngAfterViewInit(): void {


    if (this.data?.length > 0) {
      this.selectValues = this.data;
    }

    if (this.data) {
      if (this.data.length > 0) {
        this.selectValues = this.data;
      }
    }


  }

  ngOnInit(): void {

    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    control.setValidators(validators);
    control.updateValueAndValidity();
    this.getEmployeeDropDown();


  }


  async getEmployeeDropDown() {

    let res = await this.genericService.ExecuteAPI_Get<IResponse[]>("Staff/GetEmployeeDropDown")
    if (res.isSuccess) {

      this.data = res.data;
      if (this.addAll) {
        this.data.unshift(this.allValue);
      }
    }
  }




  onChange(event) {

  }
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

