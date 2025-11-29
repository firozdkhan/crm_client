import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { HttpParams } from '@angular/common/http';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { GenericService } from 'src/app/services/generic.service.service';
import { ICities } from 'src/app/interfaces/locations/city';
import { IResponse } from 'src/app/interfaces/response';
import { ToastrService } from 'ngx-toastr';
import { ICity } from 'src/app/interfaces/dashboard/city';


@Component({
  selector: 'app-city-dropdown',
  templateUrl: './city-dropdown.component.html',
  styleUrls: ['./city-dropdown.component.scss']
})
export class CityDropdownComponent implements OnInit, ControlValueAccessor, OnDestroy {
  modalRef?: BsModalRef;
  @ViewChild('addMisc') mymodal: any;
  @Input('cityDate') cityDate: Array<ICommonValue>;
  @ViewChild('select', { static: true }) input: ElementRef;
  @Input() selectedValue: any;
  @Input() stateId: number = 0;
  @Input() stateName: string;
  @Input() label = 'string';
  @Input() addNew: boolean = false;
  cityData$: Observable<Array<ICity>>;
  subscription: Subscription;

  @Output("SelectChange") SelectChange: EventEmitter<any> = new EventEmitter<any>();

  dropwalut: any;

  constructor(@Optional() @Self() public controlDir: NgControl,
    private storeData: StoredDataService,
    private genericService: GenericService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {
    this.controlDir.valueAccessor = this;
    this.cityData$ = this.storeData.cityData$;

  }
  city: ICity[] = [];


  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: Date;
  selectedText: string;



  ngOnChanges(changes: SimpleChanges) {

    if (changes['stateId']) {

      this.getCity();
    }
    if (this.cityDate) {
      if (changes['cityDate']) {
        this.cityDate = changes['cityDate'].currentValue;
      }


    }
  }



  ngOnInit(): void {
    this.getCity();
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    control.setValidators(validators);
    control.updateValueAndValidity();

  }



  getCity() {
    if (this.stateId) {
      return this.storeData.cityData$.subscribe(city => {

        this.city = city.filter(v => v.stateId === this.stateId);



      });;


    }
    else {
      return this.storeData.cityData$.subscribe(city => {
        this.city = city;
      });;
    }
  }



  ngOnDestroy(): void {
    // this.subscription.unsubscribe;
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

  citySave(event: any) {

    if (event) {
      this.closeModal();
      this.storeData.loadCityData();
      this.selectedValue = event;
    }

  }
  closeModal() {
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}));
  }

  showModel() {
    this.openModal(this.mymodal);
  }

  hihowareyou(cityname: string) {
    alert("city");
  }



  CreateNew = (term: string) => {
    this.selectedText = term;

    this.showModel();

  }

  get validator() {
    if (this.controlDir.control.validator) {
      const validator = this.controlDir.control.validator({} as AbstractControl);

      if (validator) {

        if (validator['required']) {
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
