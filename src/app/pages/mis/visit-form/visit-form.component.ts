import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IClientVisit } from 'src/app/interfaces/mis/client-visit';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrl: './visit-form.component.css'
})
export class VisitFormComponent implements  OnInit, OnChanges  {
   
  CustomerForm: FormGroup;
  visitForm: FormGroup;
  buttonText: string = 'Submit';
  action:string ="new";
  yesNoSwitch:boolean = false;
   @Input() visit: IClientVisit;  

   

  constructor(
    private fb: FormBuilder,   
    private genericSErvice: GenericService,    
    private toastr: ToastrService,
   private cdref: ChangeDetectorRef,
   private datePipe : DatePipe
  ) {
     
  }
   
 
  ngOnInit(): void {
    this.CreateVisitForm();

    if(this.visit) {
      
      this.visitForm.patchValue(this.visit);
    }

   
  this.cdref.detectChanges();
    
    // this.GetCountryData();
     
  }


  //Form Create
  CreateVisitForm() {
    this.visitForm = this.fb.group({
      id: [0],
      typeId: [null, Validators.required], 
      pincode: [null, Validators.required], 
      dataId: [0],
      name: [null, Validators.required],
      address: [null],
      date: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      phoneNo: [null],       
      remarks: [null, Validators.required],
      followUpDate: [null],
      cityId: ["1089"],
      stateId: ["59"],
      countryId: ["77"]       
    });

   

     
  }

 
 
 ngOnChanges(changes: SimpleChanges) {
  this.CreateVisitForm();
    if (this.visit) {
      this.visit = changes['visit'].currentValue;
    this.visitForm.patchValue(this.visit);
    this.visitForm.controls['date'].patchValue(this.datePipe.transform(this.visit.date, 'yyyy-MM-dd'));
    if(this.visit.followUpDate){
 this.visitForm.controls['followUpDate'].patchValue(this.datePipe.transform(this.visit.followUpDate, 'yyyy-MM-dd'));
    }
     
      this.action = "edit";
      this.buttonText = "Update";
        
    }
     this.cdref.detectChanges();
  }
 

 

  async onSubmit() {
    console.log("this");
   
    if (this.visitForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    this.visit = this.visitForm.value;

    if (this.action === 'new') {
      const res:IResponse = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'Geo/AddClientVisit',
        this.visit
      );
      if (res.isSuccess) {
        this.toastr.success(res.message);
       
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    

    this.visit = this.visitForm.value;

    const res:IResponse = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'Geo/UpdateClientVisit',
      this.visit
    );

    if (res.isSuccess) {
      this.toastr.success(res.message);
      this.action = 'new';
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  cancel() {
    this.CreateVisitForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  

  
  
   
}
