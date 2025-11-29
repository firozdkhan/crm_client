import { environment } from 'src/environments/environment';

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss'],
})
export class SelectDropdownComponent implements OnInit, ControlValueAccessor {
  @ViewChild('select', { static: true }) input: ElementRef;
  @Input() selectedValue: any;
  @Input() data: ICommonValue[];
  @Input() label = 'string';
  @Input() multiple = false;
  @Input() addAll: boolean;
  @Input() isLabelShow: boolean = true;
  @Input() addNew: boolean = true;
  tagName: string = 'Create New';

  // @Output() onValueChange = new EventEmitter<any>(); ///// juned

  @Output('SelectChange') SelectChange: EventEmitter<any> =
    new EventEmitter<any>();

  @Output('NewItemAdd') NewItemAdd: EventEmitter<any> = new EventEmitter<any>();

  dropwalut: any;
  allValue: ICommonValue = { id: '0', name: 'All' };
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
      if (this.data) {
      if (this.addAll) {

        let addNewData = this.data.filter((x) => x.name == 'All');
        if (addNewData.length == 0) {
          this.data.unshift(this.allValue);
        }
      }
    }
    
    
  }
  // onSelectChange(event: any) {
  //   this.onValueChange.emit(event); //juned
  // }
 ngOnChanges(changes: SimpleChanges) {
    if (this.data) {
      this.data = changes['data'].currentValue;
      if (this.addAll) {
        
        let addNewData = this.data.filter((x) => x.name == 'All');
        if (addNewData.length == 0) {
          this.data.unshift(this.allValue);
          this.selectedValue = "0";
        }
      }
    }
  }
 
  onChange(event) {
   
  }
  onTouched() {}

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

  public setDisabledState(isDisabled: boolean): void {}

  public onValueChange(value: Event) {
    this.onChangeCallback(value);
    this.SelectChange.emit(value);
  }

  get validator() {
    if (this.controlDir.control.validator) {
      const validator = this.controlDir.control.validator(
        {} as AbstractControl
      );

      if (validator) {
        if (validator['required']) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  CreateNew = (term: string) => {
    if (this.addNew == true) {
      this.NewItemAdd.emit(term);
    }
  };
}
