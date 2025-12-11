import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions  } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { IClientVisit } from 'src/app/interfaces/mis/client-visit';
import { IDataDirectory } from 'src/app/interfaces/mis/datadirectory';
import { IStockPosting } from 'src/app/interfaces/Report/stockposting';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Button_Type } from 'src/app/shared/controls/grid/common_model';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-data-directory',
  templateUrl: './data-directory.component.html',
  styleUrl: './data-directory.component.css'
})
export class DataDirectoryComponent {
 

  pincode: any;
  dataDirectory: IDataDirectory[] = [];

  directory: IDataDirectory;

   
  typeId: number;
   

  action: string = 'new';
  buttonText: string = 'Submit';
  today = new Date();
  actions: Action_Type[] = [
     {
      class: 'btn-outline-warning',
      text: null,
      font: 'fal fa-map',
      type: 'map',
    },
    {
      class: 'btn-outline-primary',
      text: null,
      font: 'fal fa-edit',
      type: 'edit',
    },
    {
      class: 'btn-outline-danger',
      text: null,
      font: 'fal fa-trash-alt',
      type: 'delete',
      tooltip:"Delete Data"
    },
    {
      class: 'btn-outline-success',
      text: null,
      font: 'fal fa-taxi',
      type: 'visit',
      tooltip:"Visit this client"
    },
  ];
  categories: any[];
  gridFilter: Array<GridFilter> = [];
  trans: any;



     visit =  {} as IClientVisit;  
  modalRef?: BsModalRef;
 @ViewChild('addVisit') mymodal: any;
label:string=" Visit"
  config: ModalOptions = { class: 'modal-xl' };
   



  constructor(
    private datePipe: DatePipe,
    private router:Router,
       private modalService: BsModalService,
    private toastr: ToastrService,
    private genericService: GenericService,
     
  ) {

     
  
   
  
   
  
  
   
   
   

   this.gridFilter.push(<GridFilter>{ DisplayText: 'Name', ColumnName: 'name', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Person', ColumnName: 'contactPerson', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Category', ColumnName: 'dataTypeName', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Pincode', ColumnName: 'pincode', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Address', ColumnName: 'address', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Phone No.', ColumnName: 'contactNo', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Email Id', ColumnName: 'emailid', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Website', ColumnName: 'website', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Latitute', ColumnName: 'latitude', Type: 'string', Is_Sort: true, Is_Visible: true  });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Longitude', ColumnName: 'longitude', Type: 'string', Is_Sort: true, Is_Visible: true   });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'State', ColumnName: 'stateName', Type: 'string', Is_Sort: true, Is_Visible: false  });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'City', ColumnName: 'cityName', Type: 'string', Is_Sort: true, Is_Visible: true});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Facebook', ColumnName: 'facebook', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'YouTube', ColumnName: 'youTube', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Twitter', ColumnName: 'twitter', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Instagram', ColumnName: 'instagram', Type: 'string', Is_Sort: true, Is_Visible: false });
    this.gridFilter.push(<GridFilter>{ DisplayText: "Edit", ColumnName: "Action", Type: "string", Actions: this.actions, Is_Visible: true });

  }

    buttons: Button_Type[] = [
  
      { class: 'btn-icon btn btn-success', text: null, font: 'fal fa-plus', type: 'add', tooltip: "Add New Data" },
      
    ];

  ngOnInit(): void {
     
     
  }

  async GetData() {
    let parems = new HttpParams()
    .set("pincode",this.pincode)
    .set("typeId",this.typeId);
   

     
    

    const res = await this.genericService.ExecuteAPI_Get<IResponse>('Geo/GetDataDirectory',parems);
    if (res && res.data) {
      this.dataDirectory = res.data;
    } else {
      this.dataDirectory = [];
      this.toastr.warning('No data found');
    }
  }


    buttonClick(RowItem: any) {

    if (RowItem.action === "add") {
     this.router.navigate(['/mis/directory']);
    }
    
  }


   actionRow(RowItem: any) {
    this.directory = RowItem.item
    this.visit.dataId = this.directory.id;
    this.visit.address = this.directory.address;
    this.visit.name = this.directory.name;
    this.visit.phoneNo = this.directory.contactNo;
    this.visit.pincode = this.directory.pincode;
    this.visit.typeId = this.directory.typeId;
    this.visit.id = 0;


    if (RowItem.action === 'map') {
       
      window.open( "https://maps.google.com/?q=" + this.directory.latitude +"," + this.directory.longitude, "_blank");
      // this.router.navigate(['/report/peritemstock'], {
      //   queryParams: { productId: RowItem.item.productId },
      // });
    }
     if (RowItem.action === "delete") {
      this.deleteData(this.directory.id);
    }
    if (RowItem.action === 'visit') {
    
      this.openModal(this.mymodal);
    }

    
  }

  async filterByDate() {
    if (!this.pincode || !this.typeId) {
      this.toastr.warning('Please select data');
      return;
    }

     
    await this.GetData();
  }

  async clearFilter() {
     
    await this.GetData();
  }

    async deleteData(id: number) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this Data!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let params = new HttpParams().set("id", id.toString());
          let res:IResponse = await this.genericService.ExecuteAPI_Delete("Geo/DeleteDirectory", params);
          if (res) {
          this.dataDirectory = this.dataDirectory.filter(data => data.id !== id);
            // this.categories = this.categories.filter(category => category.id !== miscId);
            Swal.fire(
               'Deleted!',
           res.message,
            'success'
              
            );
          }
        }
      });
    }

  

  pageChanged(obj: any) {}


  openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.config);
    }

     closeModal() {
    this.modalRef.hide();
  }
}
