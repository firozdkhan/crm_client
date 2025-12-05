import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
 
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import * as maplibregl from 'maplibre-gl';
import { IStaffLocation } from 'src/app/interfaces/Report/stafflocation';
declare var bootstrap: any;
@Component({
  selector: 'app-locationfetching',
  templateUrl: './locationfetching.component.html',
  styleUrls: ['./locationfetching.component.css']
})
export class LocationfetchingComponent {
  map!: maplibregl.Map;
  stafflocations: IStaffLocation[] = [];
  gridFilter: Array<GridFilter> = [];
  today = new Date();
  staffLocationForm: FormGroup;
  actions: Action_Type[] = [
    // { class: 'btn-outline-info', text: null, tooltip: 'View Report', font: 'fal fa-file-alt', type: 'report', },
    // {class: 'btn-outline-success',text: null,tooltip: 'View Salary Slip',font: 'fal fa-file-alt',type: 'salary',},
  ];

  constructor(
    private route: ActivatedRoute, private router: Router, private generic: GenericService, private fb: FormBuilder) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Name', ColumnName: 'staffName', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Latitute', ColumnName: 'latitute', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Longitute', ColumnName: 'longitude', Type: 'string', Is_Sort: true, Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Date', ColumnName: 'appdateTime', Type: 'datetime', Is_Sort: true, Is_Visible: true, });
    // this.gridFilter.push(<GridFilter>{ DisplayText: 'Action', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true, });


  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.staffLocationForm = this.fb.group({
      staffId: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.staffLocationForm.valid) {
      const { staffId, fromDate, toDate } = this.staffLocationForm.value;
      const fromDateStr = this.formatDate(fromDate);
      const toDateStr = this.formatDate(toDate);
      this.GetStaffLocationData(staffId, fromDateStr, toDateStr);
    }
  }


  formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  async GetStaffLocationData(staffId: number, fromDate: string, toDate: string) {
    try {
      let res = await this.generic.ExecuteAPI_Get<IResponse>(
        `PhoneLoginUserLocationCheck/GetStaffLocationList?staffId=${staffId}&fromdate=${fromDate}&todate=${toDate}`
      );

      if (res.isSuccess) {
        this.stafflocations = res.data;
      } else {
        console.warn(res.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  reset() {
    this.staffLocationForm.reset();
  }


  ////// Map //////

  actionRow(event: any) {
    if (event.action === 'report') {
      const row = event.item; // yahan se actual data milega

      if (!row.latitute || !row.longitude) {
        alert("Location data not available for this staff!");
        return;
      }

      // Modal open karo
      const modalEl = document.getElementById('locationMapModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      // Map show karne ke liye thoda delay
      // setTimeout(() => {
      //   this.initMap(Number(row.longitude), Number(row.latitute), row.staffName);
      // }, 300);

      setTimeout(() => {
        this.map.resize(); // ye map ko correctly render karne me help karega
      }, 300);
    }


  }





  getSelectedRows(): IStaffLocation[] {
    debugger
    return this.stafflocations.filter(x => x.selectedRow);
  }

  showSelectedOnMap() {
    const selectedLocations = this.stafflocations.filter(x => x.selectedRow);
    if (selectedLocations.length === 0) {
      alert("Please select at least one staff!");
      return;
    }

    // Modal open karo
    const modalEl = document.getElementById('locationMapModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    setTimeout(() => {
      this.initMultipleMap(selectedLocations);
    }, 300);
  }

initMultipleMap(locations: IStaffLocation[]) {
  if (this.map) this.map.remove();

  const first = locations[0];
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
        { id: 'osm', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 17 } // important
      ]
    },
    center: [Number(first.longitude), Number(first.latitute)],
    zoom: 14 ,
    maxZoom :16
  });

  this.map.addControl(new maplibregl.NavigationControl());

locations.forEach(loc => {
  const dateTime = new Date(loc.appdateTime);
  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 08:59

  new maplibregl.Marker({ color: "#ff0000" })
    .setLngLat([Number(loc.longitude), Number(loc.latitute)])
    .setPopup(
      new maplibregl.Popup().setHTML(`
        📍 <b>${loc.staffName}</b><br>
        Date: ${formattedDate}<br>
        Time: ${formattedTime}
      `)
    )
    .addTo(this.map);
});


  // modal open hone ke baad map ko resize karo
  setTimeout(() => {
    this.map.resize();
  }, 500);
}

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
