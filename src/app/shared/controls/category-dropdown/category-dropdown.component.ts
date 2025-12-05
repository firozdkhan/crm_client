import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { GenericService } from 'src/app/services/generic.service.service';
import { IResponse } from 'src/app/interfaces/response';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.component.html',
  styleUrls: ['./category-dropdown.component.scss'],
})
export class CategoryDropdownComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  @ViewChild('select', { static: true }) input: ElementRef;
  modalRef?: BsModalRef;
  @ViewChild('addMisc') mymodal: any;
  @Input() selectedValue: any;
  @Input() catId: number;
  @Input() addAll: boolean;
  @Input() addNew: boolean = true;
  @Input() label = 'string';
  @Input() isFocus: boolean = false;
  @Input() isLabelShow: boolean = true;
    @Input() isDisabled: boolean = false;


  miscData$: Observable<Array<IMisc>>;
  miscdata: Array<IMisc>;
  addString: string = 'All';
  tagName: string = 'Create New';
  misc: IMisc = {
    id: 0,
    name: this.addString,
    parentId: 0,
    parentName: this.addString,
    shortCode: '',
    description: '',
  };

  subscription: Subscription;
  miscForm: FormGroup;
  category: IMisc;

  public value: Date;
  @Output('SelectChange') SelectChange: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('selectText') selectText: EventEmitter<any> = new EventEmitter<any>();
  dropwalut: any;

  constructor(
    @Optional() @Self() public controlDir: NgControl,
    private storedData: StoredDataService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private genericSErvice: GenericService
  ) {
    this.controlDir.valueAccessor = this;
    this.miscData$ = this.storedData.miscData$;
  }

  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};
  catName: string;

  private createMiscData() {
    // the function loadAllParkings in the service returns an observable, so we can do the subscription here
    this.subscription = this.miscData$.subscribe((misc: IMisc[]) => {
      // now you have the parkings array, loop over it

      this.miscdata = misc.filter((v) => v.parentId === this.catId);
      if (this.addAll) {
        this.miscdata.unshift(this.misc);
        this.selectedValue = 0;
      }
    });
  }

  ngOnInit(): void {
    if (this.addNew == false) {
      this.tagName = 'Not Available';
    }
    this.createMiscData();
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    control.setValidators(validators);
    control.updateValueAndValidity();

    this.createMicForm();
  }

  ngOnDestroy(): void {
    //  this.subscription.unsubscribe;
  }

  onChange(event) {}
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
    if (value) {
      this.selectText.emit(this.miscdata.find((m) => m.id === +value).name);
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}));
  }

  showModel() {
    this.openModal(this.mymodal);
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

  createMicForm() {
    this.miscForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }
  async savecategory() {
     
    this.category = this.miscForm.value;
    this.category.parentId = this.catId;
    let res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
      'MasterMisc/AddNewCategory',
      this.category
    );

    if (res) {
      this.storedData.loadMiscData();

      this.closeModal();
      this.selectedValue = res.data.id;
      this.onValueChange(res.data.id);
      this.miscdata.push(res.data);
      console.log(res);
    }
  }

  CreateNew = (term: string) => {
     
    if (this.addNew == true) {
      this.showModel();
      this.miscForm.controls['name'].setValue(term);
      this.catName = term;
      console.log(this.miscForm.value);
    }
  };
}
