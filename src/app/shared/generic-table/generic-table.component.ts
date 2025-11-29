import { Component, Input, OnInit } from '@angular/core';
import { Column, Row } from '../interfaces/generic.table';


@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent<T> implements OnInit {
  @Input() columns: Column<T>[];
  @Input() rows: Row<T>[];
  public columnNames: string[];
  dtOptions: any = {};
  constructor() { }

  ngOnInit(): void {

    this.columnNames = this.columns.map((column) => column.name.toString());
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      autoWidth: false,
      pageLength: 25,
      processing: true,
      buttons: [
        {
          extend: 'pdfHtml5',
          attr: {
            id: 'btn-pdf',
            style: 'display:none'
          }
        },
        {
          extend: 'excelHtml5',
          attr: {
            id: 'btn-excel',
            style: 'display:none'
          }
        },
        {
          extend: 'csvHtml5',

          attr: {
            id: 'btn-csv',
            style: 'display:none'
          }
        },
        {
          extend: 'copyHtml5',
          attr: {
            id: 'btn-copy',
            style: 'display:none'
          }
        },
        {

          extend: 'print',
          attr: {
            id: 'btn-print',
            style: 'display:none'
          }
        }
      ],
      dom:
        `<'row mb-3'<'col-sm-12 col-md-6 d-flex align-items-center justify-content-start'f><'col-sm-12 col-md-6 d-flex align-items-center justify-content-end'lB>>
         <'row'<'col-sm-12'tr>>
         <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`
    };
  }

  btn_copy(): void {
    // tslint:disable-next-line:no-shadowed-variable
    const element: HTMLElement = document.getElementById('btn-print') as HTMLElement;
    element.click();

  }
  btn_print(): void {
    // tslint:disable-next-line:no-shadowed-variable
    const element: HTMLElement = document.getElementById('btn-print') as HTMLElement;
    element.click();

  }
  btn_excel(): void {
    // tslint:disable-next-line:no-shadowed-variable
    const element: HTMLElement = document.getElementById('btn-excel') as HTMLElement;
    element.click();

  }
  btn_csv(): void {
    // tslint:disable-next-line:no-shadowed-variable
    const element: HTMLElement = document.getElementById('btn-csv') as HTMLElement;
    element.click();

  }
  btn_pdf(): void {
    // tslint:disable-next-line:no-shadowed-variable
    const element: HTMLElement = document.getElementById('btn-pdf') as HTMLElement;
    element.click();

  }
}
