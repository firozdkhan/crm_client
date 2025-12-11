import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, AbstractControl } from '@angular/forms';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { IJWTTokan } from '../../interfaces/jwt.tokan';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.css'
})
export class UserDropdownComponent implements  OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild('select', { static: true }) input: ElementRef;
  @Input() selectedValue: any;

  @Input() label = 'string';
   @Input() isDisabled = false;
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
  decoded :IJWTTokan;

  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: any;

   
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
    const token = localStorage.getItem('smart_token');
      this.decoded = jwtDecode<IJWTTokan>(token);
    this.selectedValue = this.decoded.nameid;
    if(this.decoded.groupsid=="1") {
      this.isDisabled = true;
    }
   
  
 
 
  }

   


  async getEmployeeDropDown() {

    let res = await this.genericService.ExecuteAPI_Get<IResponse[]>("Core/GetUsers")
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

  propagateChange = (_: any) => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.onChangeCallback = fn;

     this.propagateChange = fn;
     if (this.value == null) {
      const token = localStorage.getItem('smart_token');
      this.decoded = jwtDecode<IJWTTokan>(token);
    this.propagateChange(this.decoded.nameid);
     }

     
   

    
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

