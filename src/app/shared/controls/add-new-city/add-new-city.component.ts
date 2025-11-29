import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { ICity } from 'src/app/interfaces/dashboard/city';
import { IResponse } from 'src/app/interfaces/response';
import { IState } from 'src/app/interfaces/settings/state';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';

@Component({
  selector: 'app-add-new-city',
  templateUrl: './add-new-city.component.html',
  styleUrl: './add-new-city.component.css'
})
export class AddNewCityComponent implements OnInit {
  @Input () stateId:string;
  @Input() newName:string;

  constructor(private toastr: ToastrService, private generic: GenericService,
    private fb: FormBuilder, private sharedService: StoredDataService) {
      }

      @Output("cityAdd") cityAdd: EventEmitter<any> = new EventEmitter<any>();

  
  city: ICity;
  cityForm: FormGroup;
  cityList:ICity[]=[];
   
  _catLabels :ICategoryLabels =  CategoryLabelData;
  submitted = false;
   
  buttonText: string = "Save";
   
  headers_object: HttpHeaders;
   

  ngOnInit() {
    
    this.createForm();

     
     
  }

  pageChanged(obj: any) { }

  

  createForm() {
    this.cityForm = this.fb.group({
      id: [0, Validators.required],
      stateId: [this.stateId, [Validators.required]],      
      name: [this.newName, [Validators.required]],
      
    });
  }

  cancel() {
    this.createForm();
  }

  async onSubmit(feeForm: FormGroup) {
    this.city = feeForm.value;
     
      let data = await this.generic.ExecuteAPI_Post<IResponse>('Location/SaveCity', this.city);
      if (data.isSuccess) {
      this.cityList = data.data;
      this.sharedService.loadCityData();
      let maxValue = this.cityList.reduce((acc, value) => {
        return (acc = acc > value.id ? acc : value.id);
    }, 0);
    
    
      this.cityAdd.emit(maxValue)
      
      } 
    
    this.createForm();
    this.buttonText = "Save";
  }

   

   

  

   


  
}
