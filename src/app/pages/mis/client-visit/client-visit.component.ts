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
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-visit',
  templateUrl: './client-visit.component.html',
  styleUrl: './client-visit.component.css'
})
export class ClientVisitComponent {
  clientVisits: IClientVisit[] = [];
  clientVisit: IClientVisit;
  
   
  action: string = 'new';
   
  gridFilter: Array<GridFilter> = [];

  actions: Action_Type[] = [
    {
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
      tooltip: 'Edit'
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
      tooltip: 'Delete'

    },
  ];


  constructor(
    
    private genericService: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService
  ) {
     
   
 
    this.gridFilter.push(<GridFilter>{DisplayText: 'Type', ColumnName: 'followType', Type: 'string',Is_Visible: true,});
     this.gridFilter.push(<GridFilter>{DisplayText: 'Date', ColumnName: 'date', Type: 'date',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Name', ColumnName: 'name', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'PinCode', ColumnName: 'pincode', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Phone', ColumnName: 'phoneNo', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Address', ColumnName: 'address', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Remarks', ColumnName: 'remarks', Type: 'string',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{DisplayText: 'followUpDate', ColumnName: 'followUpDate', Type: 'date',  Is_Visible: true,  });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });

    
  }

  ngOnInit(): void {
    
    this.GetVisitData();
    
  }

  //Form Create
  

  async GetVisitData() {
    
    
    let res:IResponse = await this.genericService.ExecuteAPI_Get<IResponse>('Geo/GetAllVisit');
    
    if (res.data) {
      this.clientVisits = res.data;
    }
  }

  async deleteMenu(miscId: number) {
     
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set('id', miscId.toString());
        let res = await this.genericService.ExecuteAPI_Delete(
          'Geo/DeleteClientVisit',
          params
        );
        if (res && res) {
          this.clientVisits = this.clientVisits.filter(
            (category) => category.id !== miscId
          );
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your record has been deleted.'),
            'success'
          );
        } else {
          this.toastr.error('Failed to delete record');
        }
      }
    });
  }

  actionRow(RowItem: any) {
   let visit = RowItem.item
    this.action = RowItem.action;
   
    if (this.action === 'delete') {
      this.deleteMenu(visit.id);
    } else {
      
      this.clientVisit = visit;
    
    }
  }

   pageChanged(event) {

  }

   

 
 
 
}
