import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpParams } from '@angular/common/http';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { GenericService } from 'src/app/services/generic.service.service';
import { IResponse } from 'src/app/interfaces/response';


@Component({
  selector: 'app-state-dropdown',
  templateUrl: './state-dropdown.component.html',
  styleUrls: ['./state-dropdown.component.scss']
})
export class StateDropdownComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @Input('statedata') statedata: Array<ICommonValue>;
  @ViewChild('select', { static: true }) input: ElementRef;
  @Input() selectedValue: any;
  @Input() label = 'string';
  @Input() countryId: number;
  @Input() countryName: string;
  @Input() addNew: boolean = false;
  @ViewChild('addMisc') mymodal: any;
  stateData$: Observable<Array<ICommonValue>>;

  state: ICommonValue = { id: null, name: "Add New" };

  subscription: Subscription;

  @Output("SelectChange") SelectChange: EventEmitter<any> = new EventEmitter<any>();
  @Output("AddNewState") AddNewState: EventEmitter<any> = new EventEmitter<any>();
  modalRef?: BsModalRef;
  dropwalut: any;

  constructor(@Optional() @Self() public controlDir: NgControl,
    private storedData: StoredDataService,
    private modalService: BsModalService,
    private genericService: GenericService
  ) {
    this.controlDir.valueAccessor = this;
    this.stateData$ = this.storedData.stateData$;
  }


  selectedText: string;
  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

  public value: Date;




  ngOnChanges(changes: SimpleChanges) {

    if (this.statedata) {

      if (changes['statedata']) {
        this.statedata = changes['statedata'].currentValue;
      }

    }
  }

  ngOnInit(): void {
    // console.log('State check');
    // this.storedData.stateData$.subscribe(x => {

    //   console.log(x);
    // })
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    control.setValidators(validators);
    control.updateValueAndValidity();

    // this.createstateData();
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

  public onValueChange(value: string) {
    this.state.id = value;


    this.onChangeCallback(value);
    this.SelectChange.emit(this.state);


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

  CreateNew = (term: string) => {
    this.selectedText = term;
    console.log(term);
    this.showModel();

  }

  stateSave(event: any) {

    if (event) {
      // this.state = event;
      this.closeModal();
      // this.stateChange();
      // this.selectedValue = event.toString();
      // this.onChangeCallback(event);
      this.AddNewState.emit(event);

    }

  }

  async stateChange() {

    this.stateData$ = this.storedData.stateData$;
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
