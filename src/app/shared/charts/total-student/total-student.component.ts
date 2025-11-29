import { Component, Input, ViewChild } from '@angular/core';
import { I } from '@fullcalendar/core/internal-common';
import { ChartConfiguration, ChartType, ChartData, ChartEvent } from 'chart.js/auto';


import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-total-student',
  templateUrl: './total-student.component.html',
  styleUrls: ['./total-student.component.css']
})
export class TotalStudentComponent {

  @Input() studentClass: string[];
  @Input() studentCount: number[];
  @Input() newStudent: number[];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor() {


  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },

    },
  };
  public barChartType: ChartType = 'bar';
  // public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'>;

  ngOnInit() {


  }

  ngAfterViewInit() {


  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {

  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {

  }


}
