import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IMisc } from 'src/app/interfaces/dashboard/misc';
import { IFees } from 'src/app/interfaces/fees';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SystemService } from '../grid/SystemService';
import { GridFilter, Action_Type } from '../grid/common_model';
import { ICreateUser } from 'src/app/user/interfaces/user';
import { ICategoryLabels } from 'src/app/interfaces/categoryId.interface';
import { CategoryLabelData } from 'src/app/interfaces/categoryData';
import { IState } from 'src/app/interfaces/settings/state';
import { SharedService } from '../../services/shared.service';
import { StoredDataService } from 'src/app/services/stored-data.service';

@Component({
  selector: 'app-add-new-state',
  templateUrl: './add-new-state.component.html',
  styleUrl: './add-new-state.component.css'
})
export class AddNewStateComponent implements OnInit {
  @Input () countryId:string;
  @Input() newName:string;

  constructor(private toastr: ToastrService, private generic: GenericService,
    private fb: FormBuilder, private sharedService: StoredDataService) {
      }

      @Output("stateAdd") stateAdd: EventEmitter<any> = new EventEmitter<any>();

  
  state: IState;
  stateForm: FormGroup;
  stateList:IState[]=[];
   
  _catLabels :ICategoryLabels =  CategoryLabelData;
  submitted = false;
   
  buttonText: string = "Save";
   
  headers_object: HttpHeaders;
   

  ngOnInit() {
    
    this.createForm();

     
     
  }

  pageChanged(obj: any) { }

  

  createForm() {
    this.stateForm = this.fb.group({
      id: [0, Validators.required],
      countryId: [this.countryId, [Validators.required]],      
      name: [this.newName, [Validators.required]],
      
    });
  }

  cancel() {
    this.createForm();
  }

  async onSubmit(feeForm: FormGroup) {
    this.state = feeForm.value;
     
      let data = await this.generic.ExecuteAPI_Post<IResponse>('Location/SaveState', this.state);
      if (data.isSuccess) {
      this.stateList = data.data;
      this.sharedService.loadStateData();
      let maxValue = this.stateList.reduce((acc, value) => {
        return (acc = acc > value.id ? acc : value.id);
    }, 0);
    
    
      this.stateAdd.emit(maxValue)
      
      } 
    
    this.createForm();
    this.buttonText = "Save";
  }

   

   

  

   


  
}
