import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent {


  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() labels: string[];
  @Input() data: number[];
  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,

    // We use these empty structures as placeholders for dynamic theming.

    plugins: {

      legend: {
        display: true,
        position: 'top'


      },

    },
  };

  public pieChartType: ChartType = 'pie';
  // public pieChartPlugins = [DatalabelsPlugin];

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }



}
