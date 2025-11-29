import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';



@Component({
  selector: 'app-student-attendance-chart',
  templateUrl: './student-attendance-chart.component.html',
  styleUrls: ['./student-attendance-chart.component.css']
})
export class StudentAttendanceChartComponent {


  @Input() attendanceLabel: string[];
  @Input() presentStudent: number[];
  @Input() absentStudent: number[];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor() {


  }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataset[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Present', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Absent', stack: 'a' }
  ];



  ngOnInit() {
  }
}
