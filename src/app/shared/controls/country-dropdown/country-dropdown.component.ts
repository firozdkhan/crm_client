import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { StoredDataService } from 'src/app/services/stored-data.service';
 

@Component({
  selector: 'app-country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss']
})
export class CountryDropdownComponent  implements OnInit, ControlValueAccessor, OnDestroy {
  @ViewChild('select', { static: true }) input: ElementRef;
  @Input() selectedValue: any;  
  @Input() label = 'string';

  countryData$: Observable<Array<ICommonValue>>;
  countrydata: Array<ICommonValue>;

  subscription: Subscription;

  @Output("SelectChange") SelectChange: EventEmitter<any> = new EventEmitter<any>();

  dropwalut: any;

  constructor(@Optional() @Self() public controlDir: NgControl,
    private storedData: StoredDataService
  ) {
    this.controlDir.valueAccessor = this;
    this.countryData$ = this.storedData.countryData$;
  }



  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: Date;

  private createcountryData() {
    // the function loadAllParkings in the service returns an observable, so we can do the subscription here
    this.subscription = this.countryData$.subscribe((country: ICommonValue[]) => {

       
      // now you have the parkings array, loop over it
      
       
        this.countrydata = country;
       

    });
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    control.setValidators(validators);
    control.updateValueAndValidity();
    this.createcountryData();
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe;
    }
    // 
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
}
