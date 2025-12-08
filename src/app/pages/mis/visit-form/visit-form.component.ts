import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IClientVisit } from 'src/app/interfaces/mis/client-visit';
import { IResponse } from 'src/app/interfaces/response';
import { ICustomer } from 'src/app/interfaces/sales/Customer';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrl: './visit-form.component.css'
})
export class VisitFormComponent {
   
  visit: IClientVisit;  
  visitForm: FormGroup;
  buttonText: string = 'Submit';
  action:string ="new";
   

   

  constructor(
    private fb: FormBuilder,   
    private genericSErvice: GenericService,    
    private toastr: ToastrService
  ) {
     
  }

  ngOnInit(): void {
    this.CreateVisitForm();
  
    
    // this.GetCountryData();
  }

 id: number
  typeId: number
  followType: string
  dataId: number
  name: string
  address: string
  phoneNo: string
  date: string
  remarks: string
  followUpDate: string
  userId: number
  userName: string

  //Form Create
  CreateVisitForm() {
    this.visitForm = this.fb.group({
      id: [0],
      typeId: [null, Validators.required], 
       pincode: [null, Validators.required], 
      dataId: [0],
      name: [null, Validators.required],
      address: [null],
      date: [null],
      phoneNo: [null], 
      remarks: [null, Validators.required],
      followUpDate: [null],
      cityId: ["1089"],
      stateId: ["59"],
      countryId: ["77"]       
    });
  }

 
 

 

 

  async onSubmit() {
     
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

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'CustomerApi/UpdateCustomer',
      this.visit
    );

    if (res.isSuccess) {
      this.toastr.success('Customer updated successfully');
      
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
