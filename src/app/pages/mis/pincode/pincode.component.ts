import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { IResponse } from 'src/app/interfaces/response';
import * as maplibregl from 'maplibre-gl';
 

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.css']
})
export class PincodeComponent implements OnInit, AfterViewInit {

  pincodeForm!: FormGroup;
  map!: maplibregl.Map;
  polygonLayerId = 'pincode-polygon';
  resultData: any = null;

  constructor(
    private toastr: ToastrService, private generic: GenericService, private fb: FormBuilder, private datepipe: DatePipe, private trans: TranslatePipe
  ) { }

  ngOnInit(): void {
   this.createRegistrationForm();
  }

  createRegistrationForm(){
 this.pincodeForm = this.fb.group({
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
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
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [78.9629, 20.5937],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18
    });

    this.map.addControl(new maplibregl.NavigationControl());
  }

  onSubmit(): void {
    if (this.pincodeForm.invalid) {
      this.toastr.warning('Please enter a valid 6-digit pincode');
      return;
    }

    const pincode = this.pincodeForm.value.pincode;

    this.generic.ExecuteAPI_Get<IResponse>('Geo/GetDataByPincode?pincode=' + pincode)
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
      .catch(err => {
        this.toastr.error('Error fetching data');
        console.error(err);
      });
  }

  showSchoolPins(schools: any[]): void {
    
    if (!this.map || !schools?.length) return;

    schools.forEach(school => {
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
      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
      <b>${school.schoolName}</b><br>
      <small>${school.address}</small><br>
      <small>${school.contactPerson}</small><br>
      <hr style="margin:4px 0;">
      📍 <small><b>Lat:</b> ${lat.toFixed(6)}, <b>Lng:</b> ${lng.toFixed(6)}</small>
       <button type="button" class="btn btn-primary ml-auto waves-themed"> Visited </button>

    `);

      new maplibregl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }



  showPinsInsideArea(coordinates: any[]): void {
    coordinates.forEach(c => {
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


    const coords = coordinates.map(c => [parseFloat(c.longidute), parseFloat(c.latitute)]);
    if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
      coords.push(coords[0]);
    }


    const polygonGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coords]
          },
          properties: {}
        }
      ]
    };


    this.map.addSource(this.polygonLayerId, {
      type: 'geojson',
      data: polygonGeoJSON
    });

    this.map.addLayer({
      id: this.polygonLayerId,
      type: 'line',
      source: this.polygonLayerId,
      paint: {
        'line-color': '#ff0000',
        'line-width': 3
      }
    });


    const bounds = new maplibregl.LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
    this.map.fitBounds(bounds, { padding: 40, maxZoom: 15 });
  }



}
