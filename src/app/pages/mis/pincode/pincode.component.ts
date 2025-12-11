import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { IResponse } from 'src/app/interfaces/response';
import * as maplibregl from 'maplibre-gl';
import { IClientVisit } from 'src/app/interfaces/mis/client-visit';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.css'],
})
export class PincodeComponent implements OnInit, AfterViewInit {
  pincodeForm!: FormGroup;
  map!: maplibregl.Map;
  polygonLayerId = 'pincode-polygon';
  resultData: any = null;
  visit = {} as IClientVisit;

  constructor(
    private toastr: ToastrService,
    private generic: GenericService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private trans: TranslatePipe,
      private modalService: BsModalService,
    private el: ElementRef, private renderer: Renderer2
  ) {}



  modalRef?: BsModalRef;
   @ViewChild('addVisit') mymodal: any;
  label:string=" Visit"
    config: ModalOptions = { class: 'modal-xl' };

  ngOnInit(): void {
    this.createRegistrationForm();
  }

   

  createRegistrationForm() {
    this.pincodeForm = this.fb.group({
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    
      
  }

   createDynamicElementWithListener() {
    // 1. Create the new element
    const newButton = document.getElementById("btnVisit");
     

    // 3. Attach the event listener using Renderer2's `listen` method
    // listen() returns an "unsubscribe" function which you should typically call in ngOnDestroy
    this.renderer.listen(newButton, 'click', (event) => {
      console.log('Manual element clicked:', event);
      alert('Manual DOM click handler fired!');
    });
  }
 

  onClick() {
    console.log("this");
  }

  cancel(): void {
    this.createRegistrationForm();
  }

  initMap(): void {
    this.map = new maplibregl.Map({
      container: 'mapContainer',
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [78.9629, 20.5937],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18,
    });

    this.map.addControl(new maplibregl.NavigationControl());
  }

  onSubmit(): void {
    if (this.pincodeForm.invalid) {
      this.toastr.warning('Please enter a valid 6-digit pincode');
      return;
    }

    const pincode = this.pincodeForm.value.pincode;

    this.generic
      .ExecuteAPI_Get<IResponse>('Geo/GetDataByPincode?pincode=' + pincode)
      .then((res: IResponse) => {
        if (res.isSuccess && res.data) {
          this.resultData = res.data;

          this.toastr.success('Pincode data loaded');
          this.showPincodeArea(res.data.coordinates);

          // 👇 yahan schools ke pins show honge
          if (res.data.schools && res.data.schools.length > 0) {
            this.showSchoolPins(res.data.schools);
          }
        } else {
          this.resultData = null;
          this.toastr.info('No data found for this pincode');
        }
      })
      .catch((err) => {
        this.toastr.error('Error fetching data');
        console.error(err);
      });
  }

  showSchoolPins(schools: any[]): void {
    if (!this.map || !schools?.length) return;

    schools.forEach((school) => {
      const lat = parseFloat(school.latitude);
      const lng = parseFloat(school.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const el = document.createElement('div');
      el.className = 'school-marker';
      el.style.width = '6px';
      el.style.height = '6px';
      el.style.backgroundColor = '#28a745';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 6px rgba(0,0,0,0.5)';
      el.style.cursor = 'pointer';
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `
      <b>${school.name}</b><br>
      <small>${school.address}</small><br>
      <small>${school.contactPerson}</small><br>
      <hr style="margin:4px 0;">
      📍 <small><b>Lat:</b> ${lat.toFixed(6)}, <b>Lng:</b> ${lng.toFixed(
        6
      )}</small>
       

    `

    

    const _visitButton = document.createElement('button');
            _visitButton.textContent = 'Visited'; // Set button text
            _visitButton.type = 'button';
            _visitButton.className = 'btn btn-success ml-2 waves-themed';
            _visitButton.setAttribute('aria-label', 'Go to Home View');

            // Add an event listener to the button
            _visitButton.addEventListener('click', () => {
               this.visit.dataId = school.id;
    this.visit.address = school.address;
    this.visit.name = school.name;
    this.visit.phoneNo = school.contactNo;
    this.visit.pincode = school.pincode;
    this.visit.typeId = school.typeId;
    this.visit.id = 0;
                 this.openModal(this.mymodal);
            });

            const _notFound = document.createElement('button');
            _notFound.textContent = 'Not Found'; // Set button text
            _notFound.type = 'button';
            _notFound.className = 'btn btn-danger ml-2 waves-themed';
            _notFound.setAttribute('aria-label', 'Go to Home View');

            // Add an event listener to the button
            _notFound.addEventListener('click', () => {
              this.deleteData(school.id);
                  
            });

      newDiv.appendChild(_visitButton); 
       newDiv.appendChild(_notFound);    
      const popup = new maplibregl.Popup({ offset: 15 }).setDOMContent(newDiv);   

      new maplibregl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
    });

    
  }
 openModal(template: TemplateRef<any>) {
  
      this.modalRef = this.modalService.show(template, this.config);
    }

     closeModal() {
    this.modalRef.hide();
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
            let res:IResponse = await this.generic.ExecuteAPI_Delete("Geo/DeleteDirectory", params);
            if (res) {
            
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
 
  showPinsInsideArea(coordinates: any[]): void {
    coordinates.forEach((c) => {
      const lng = parseFloat(c.longidute);
      const lat = parseFloat(c.latitute);

      const el = document.createElement('div');
      el.className = 'pincode-marker';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.backgroundColor = '#007bff';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 4px rgba(0,0,0,0.5)';
      el.style.cursor = 'pointer';

      const popup = new maplibregl.Popup({ offset: 10 }).setText(
        `Lat: ${lat}, Lng: ${lng}`
      );

      new maplibregl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  showPincodeArea(coordinates: any[]): void {
    if (!this.map || !coordinates?.length) return;

    if (this.map.getLayer(this.polygonLayerId)) {
      this.map.removeLayer(this.polygonLayerId);
      this.map.removeSource(this.polygonLayerId);
    }

    const coords = coordinates.map((c) => [
      parseFloat(c.longidute),
      parseFloat(c.latitute),
    ]);
    if (
      coords[0][0] !== coords[coords.length - 1][0] ||
      coords[0][1] !== coords[coords.length - 1][1]
    ) {
      coords.push(coords[0]);
    }

    const polygonGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coords],
          },
          properties: {},
        },
      ],
    };

    this.map.addSource(this.polygonLayerId, {
      type: 'geojson',
      data: polygonGeoJSON,
    });

    this.map.addLayer({
      id: this.polygonLayerId,
      type: 'line',
      source: this.polygonLayerId,
      paint: {
        'line-color': '#ff0000',
        'line-width': 3,
      },
    });

    const bounds = new maplibregl.LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
    this.map.fitBounds(bounds, { padding: 40, maxZoom: 15 });
  }
}
