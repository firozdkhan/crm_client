import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as maplibregl from 'maplibre-gl';
import { ToastrService } from 'ngx-toastr';
import { Icompany } from 'src/app/interfaces/master/company-master';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { StoredDataService } from 'src/app/services/stored-data.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { GridFilter, Action_Type } from 'src/app/shared/models/common_model';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @ViewChild('goUp', { static: true }) contentPage: ElementRef;
  CompanyMasterForm: FormGroup;
  CompanyMasterList: Icompany[] = [];
  Company: Icompany
  action: string = "new";
  gridFilter: Array<GridFilter> = [];
  disable: boolean = false;
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, tooltip: "Edit", font: 'fal fa-edit', type: 'edit' },
    { class: 'btn-outline-danger', text: null, tooltip: "Delete", font: 'fal fa-trash-alt', type: 'delete' },
    { class: 'btn-outline-success', text: null, tooltip: "Map", font: 'fas fa-map-marker-alt', type: 'map' },
  ];
  buttonText: string = 'Submit';

  constructor(
    private http: HttpClient, private fb: FormBuilder, private toastrService: ToastrService, private storedData: StoredDataService, private systemService: SystemService,
    private genericService: GenericService
  ) {

    this.gridFilter.push(<GridFilter>{ DisplayText: 'Branche Name', ColumnName: 'companyName', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Address', ColumnName: 'address', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Latitute', ColumnName: 'latitute', Type: 'number', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Longitude', ColumnName: 'longitude', Type: 'number', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Mobile', ColumnName: 'phoneNo', Type: 'number', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Fax No', ColumnName: 'faxNo', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Email', ColumnName: 'email', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Website', ColumnName: 'website', Type: 'string', Is_Sort: true, Is_Visible: true });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true });
  }

  ngOnInit(): void {
    this.createCompanyMasterForm();
    this.bindCompanies();

  }

  createCompanyMasterForm() {
    this.CompanyMasterForm = this.fb.group({
      id: [0],
      companyId: ['', Validators.required],
      companyName: [''],
      address: ['', Validators.required],
      email: ['', [ValidatorService.vEmail]],
      latitute: ['', Validators.required],
      longitude: ['', Validators.required],
      phoneNo: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      faxNo: [''],
      website: ['']
    });
  }

  async bindCompanies() {
    try {
      let res = await this.genericService.ExecuteAPI_Get<IResponse>('Masters/GetAllCompanies');
      if (res.isSuccess) {
        this.CompanyMasterList = res.data;
      }
    } catch (error) {

    }
  }

  cancel() {
    this.createCompanyMasterForm();
    this.buttonText = 'Submit';
  }

  async onSubmit(form: FormGroup) {

    if (form.valid) {
      try {
        let res;
        if (this.buttonText === 'Submit') {
          res = await this.genericService.ExecuteAPI_Post<IResponse>('Masters/AddNewCompanies', form.value);
          this.toastrService.success('Company added successfully!');
        } else {
          res = await this.genericService.ExecuteAPI_Put<IResponse>('Masters/UpdateCompany', form.value);
          this.toastrService.success('Company updated successfully!');
        }

        if (res.isSuccess) {
          this.bindCompanies();
          this.cancel();
        } else {
          this.toastrService.error(res.message);
        }
      } catch (error) {

      }
    }
  }

  editData(company: Icompany) {

    this.CompanyMasterForm.patchValue(company);
    this.buttonText = 'Update';
  }

  async deleteData(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        let res = await this.genericService.ExecuteAPI_Delete<IResponse>(`Masters/DeleteCompany?id=${id}`);
        if (res.isSuccess) {
          Swal.fire('Deleted!', 'Company has been deleted.', 'success');
          this.bindCompanies();
        }
      } catch (error) {

      }
    }
  }

  map: any;
  showBranchOnMap(branch: Icompany) {
    if (!branch.latitute || !branch.longitude) {
      this.toastrService.error("Latitude or Longitude not found!");
      return;
    }

    // Modal open karo
    const modalEl = document.getElementById('locationMapModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    // Map ko thoda delay me init karo
    setTimeout(() => {
      this.initBranchMap(branch);
    }, 300);
  }

  initBranchMap(branch: Icompany) {
    if (this.map) this.map.remove();

    this.map = new maplibregl.Map({
      container: 'staffLocationMap',
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          { id: 'osm', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 17 }
        ]
      },
      center: [Number(branch.longitude), Number(branch.latitute)],
      zoom: 14
    });

    this.map.addControl(new maplibregl.NavigationControl());

    new maplibregl.Marker({ color: "#ff0000" })
      .setLngLat([Number(branch.longitude), Number(branch.latitute)])
      .setPopup(
        new maplibregl.Popup().setHTML(`
        <b>${branch.company}</b><br>
        Address: ${branch.address}<br>
        Lat: ${branch.latitute}<br>
        Lng: ${branch.longitude}
      `)
      )
      .addTo(this.map);

    setTimeout(() => {
      this.map.resize();
    }, 500);

  }



  actionRow(RowItem: any) {
    this.Company = RowItem.item;
    this.action = RowItem.action;

    if (this.action === "delete") {
      this.deleteData(this.Company.id);
    }
    else if (this.action === "map") {
      this.showBranchOnMap(this.Company);
    }
    else {
      this.disable = true;
      this.buttonText = "Update";
      this.CompanyMasterForm.patchValue(this.Company);
      this.contentPage.nativeElement.scrollIntoView();
    }
  }

  pageChanged(obj: any) { }


  closeModal() {
  const modalEl = document.getElementById('locationMapModal');

  if (modalEl) {
    // Bootstrap 5 ke liye (agar available ho)
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      try {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
        return;
      } catch {
        // agar getInstance nahi mila (Bootstrap 4)
      }
    }

    // Manual close (Bootstrap 4 fallback)
    modalEl.classList.remove('show');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.removeAttribute('aria-modal');
    (modalEl as any).style.display = 'none';
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }
}
}
